<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\Pairing;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * GET /api/chat/contacts
     * Mendapatkan daftar kontak chat aktif (Mentor/Mentee) beserta preview pesan terakhir
     */
    public function getContacts(Request $request): JsonResponse
    {
        $user = $request->user();
        $isMentee = $user->hasRole('Mentee');
        $isMentor = $user->hasRole('Mentor');

        $contactUsers = collect();
        $pairedIds = [];

        if ($isMentee) {
            // Mentee dapat berkonsultasi dengan semua mentor aktif
            $pairedIds = Pairing::where('mentee_id', $user->id)->pluck('mentor_id')->toArray();
            $contactUsers = User::whereHas('roles', function($q) {
                $q->where('name', 'Mentor');
            })->where('id', '!=', $user->id)->get();
        } elseif ($isMentor) {
            // Mentor dapat membimbing dan merespons semua mentee
            $pairedIds = Pairing::where('mentor_id', $user->id)->pluck('mentee_id')->toArray();
            $contactUsers = User::whereHas('roles', function($q) {
                $q->where('name', 'Mentee');
            })->where('id', '!=', $user->id)->get();
        } else {
            // Admin bisa chat dengan mentor atau mentee mana saja
            $contactUsers = User::where('id', '!=', $user->id)->get();
        }

        // Format data kontak dengan pesan terakhir, jumlah unread, dan status pairing
        $formattedContacts = $contactUsers->map(function ($contact) use ($user, $pairedIds, $isMentee, $isMentor) {
            $lastMessage = ChatMessage::where(function ($q) use ($user, $contact) {
                $q->where('sender_id', $user->id)->where('receiver_id', $contact->id);
            })->orWhere(function ($q) use ($user, $contact) {
                $q->where('sender_id', $contact->id)->where('receiver_id', $user->id);
            })->latest('created_at')->first();

            $unreadCount = ChatMessage::where('sender_id', $contact->id)
                ->where('receiver_id', $user->id)
                ->where('is_read', false)
                ->count();

            $isPaired = in_array($contact->id, $pairedIds);
            $pairedLabel = null;
            if ($isPaired) {
                $pairedLabel = $isMentee ? 'Mentor Pembimbing' : ($isMentor ? 'Mentee Bimbingan' : 'Bimbingan');
            }

            return [
                'id'           => $contact->id,
                'name'         => $contact->name,
                'email'        => $contact->email,
                'role'         => $contact->roles->first()->name ?? 'User',
                'avatar'       => $contact->name ? strtoupper(substr($contact->name, 0, 1)) : 'U',
                'is_paired'    => $isPaired,
                'paired_label' => $pairedLabel,
                'last_message' => $lastMessage ? $lastMessage->message : 'Belum ada percakapan.',
                'last_time'    => $lastMessage ? $lastMessage->created_at->toISOString() : null,
                'unread_count' => $unreadCount,
            ];
        });

        // Urutkan kontak:
        // 1. Pesan belum dibaca (unread_count > 0)
        // 2. Chat terbaru (last_time desc)
        // 3. Kontak yang berstatus bimbingan resmi (is_paired = true)
        // 4. Nama alfabetis
        $sortedContacts = $formattedContacts->sort(function ($a, $b) {
            if ($a['unread_count'] > 0 && $b['unread_count'] === 0) return -1;
            if ($a['unread_count'] === 0 && $b['unread_count'] > 0) return 1;

            if ($a['last_time'] && $b['last_time']) {
                return strcmp($b['last_time'], $a['last_time']);
            }
            if ($a['last_time'] && !$b['last_time']) return -1;
            if (!$a['last_time'] && $b['last_time']) return 1;

            if ($a['is_paired'] && !$b['is_paired']) return -1;
            if (!$a['is_paired'] && $b['is_paired']) return 1;

            return strcasecmp($a['name'], $b['name']);
        })->values();

        return response()->json([
            'status' => 'success',
            'data'   => $sortedContacts,
        ]);
    }

    /**
     * GET /api/chat/messages/{contactId}
     * Mengambil riwayat percakapan dengan kontak tertentu
     */
    public function getMessages(Request $request, int $contactId): JsonResponse
    {
        $user = $request->user();

        // Ambil pesan bolak-balik antara user dan kontak
        $messages = ChatMessage::where(function ($q) use ($user, $contactId) {
            $q->where('sender_id', $user->id)->where('receiver_id', $contactId);
        })->orWhere(function ($q) use ($user, $contactId) {
            $q->where('sender_id', $contactId)->where('receiver_id', $user->id);
        })
        ->orderBy('created_at', 'asc')
        ->get();

        // Tandai pesan dari kontak sebagai telah dibaca
        ChatMessage::where('sender_id', $contactId)
            ->where('receiver_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'status' => 'success',
            'data'   => $messages,
        ]);
    }

    /**
     * POST /api/chat/messages
     * Mengirim pesan baru
     */
    public function sendMessage(Request $request): JsonResponse
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message'     => 'required|string|max:2000',
        ]);

        $sender = $request->user();
        $receiver = User::findOrFail($request->receiver_id);

        $chatMessage = ChatMessage::create([
            'sender_id'   => $sender->id,
            'receiver_id' => $receiver->id,
            'message'     => trim($request->message),
            'is_read'     => false,
        ]);

        // Kirim notifikasi sistem kepada penerima pesan
        try {
            $this->notificationService->sendNotification(
                $receiver,
                "Pesan Baru dari {$sender->name}",
                Str::limit($request->message, 80),
                'direct_message'
            );
        } catch (\Exception $e) {
            // Lanjut meskipun notifikasi gagal
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Pesan berhasil dikirim.',
            'data'    => $chatMessage,
        ], 201);
    }

    /**
     * PATCH /api/chat/messages/{contactId}/read
     * Menandai semua pesan dari kontak tertentu sebagai dibaca
     */
    public function markAsRead(Request $request, int $contactId): JsonResponse
    {
        $user = $request->user();

        ChatMessage::where('sender_id', $contactId)
            ->where('receiver_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Pesan ditandai telah dibaca.',
        ]);
    }
}
