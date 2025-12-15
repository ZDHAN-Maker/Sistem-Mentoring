<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Ambil semua notifikasi user yang sedang login
     */
    public function index()
    {
        $userId = Auth::id();
        $notifications = $this->notificationService->getUserNotifications($userId);

        return response()->json($notifications);
    }

    /**
     * Buat notifikasi baru untuk user (manual)
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'title'   => 'required|string',
            'message' => 'required|string',
            'type'    => 'nullable|string',
        ]);

        $notification = $this->notificationService->createNotification(
            userId: $request->user_id,
            title: $request->title,
            message: $request->message,
            type: $request->type ?? 'general',
            notifiable: null
        );

        return response()->json([
            'message'      => 'Notifikasi berhasil dibuat',
            'notification' => $notification
        ], 201);
    }

    /**
     * Tandai notifikasi sebagai dibaca
     */
    public function markAsRead($id)
    {
        $notification = $this->notificationService->markAsRead($id);

        return response()->json([
            'message'      => 'Notifikasi ditandai sebagai dibaca',
            'notification' => $notification
        ]);
    }

    /**
     * Hapus notifikasi
     */
    public function destroy($id)
    {
        $this->notificationService->deleteNotification($id);

        return response()->json([
            'message' => 'Notifikasi berhasil dihapus'
        ]);
    }
}
