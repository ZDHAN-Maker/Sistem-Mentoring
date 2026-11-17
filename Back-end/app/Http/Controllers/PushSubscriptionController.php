<?php

namespace App\Http\Controllers;

use App\Models\PushSubscription;
use App\Services\WebPushService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    protected $webPushService;

    public function __construct(WebPushService $webPushService)
    {
        $this->webPushService = $webPushService;
    }

    /**
     * GET /api/push-subscriptions/vapid-key
     * Mengambil VAPID Public Key untuk pendaftaran Service Worker browser
     */
    public function getVapidPublicKey(): JsonResponse
    {
        return response()->json([
            'status'     => 'success',
            'public_key' => $this->webPushService->getPublicKey(),
        ]);
    }

    /**
     * POST /api/push-subscriptions
     * Mendaftarkan langganan Push Browser (Endpoint & Keys) milik user
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'endpoint' => 'required|string',
            'keys.p256dh' => 'required|string',
            'keys.auth'   => 'required|string',
        ]);

        $user = $request->user();

        $subscription = PushSubscription::updateOrCreate(
            ['endpoint' => $request->endpoint],
            [
                'user_id'          => $user->id,
                'public_key'       => $request->input('keys.p256dh'),
                'auth_token'       => $request->input('keys.auth'),
                'content_encoding' => $request->input('content_encoding', 'aesgcm'),
            ]
        );

        return response()->json([
            'status'  => 'success',
            'message' => 'Langganan notifikasi web push berhasil didaftarkan.',
            'data'    => $subscription,
        ], 201);
    }

    /**
     * DELETE /api/push-subscriptions
     * Menghapus langganan Push Browser
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'endpoint' => 'required|string',
        ]);

        PushSubscription::where('endpoint', $request->endpoint)
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Langganan notifikasi push berhasil dihapus.',
        ]);
    }

    /**
     * POST /api/push-subscriptions/test
     * Mengirim notifikasi uji coba langsung ke browser
     */
    public function sendTestPush(Request $request): JsonResponse
    {
        $user = $request->user();

        $sentCount = $this->webPushService->sendToUser(
            $user,
            "🎉 Uji Coba Notifikasi VAPID Aeterna",
            "Notifikasi push desktop aktif! Anda akan menerima update tugas, materi baru, dan jadwal bimbingan secara instan.",
            [
                'url'  => '/' . ($user->roles->first()->name ?? 'user') . '-dashboard',
                'type' => 'test_push',
            ]
        );

        return response()->json([
            'status'  => 'success',
            'message' => "Notifikasi uji coba dikirim ke {$sentCount} perangkat browser aktif.",
            'sent_devices' => $sentCount,
        ]);
    }
}
