<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Exception;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * GET /api/notifications
     * Mengambil daftar notifikasi
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['unread_only', 'per_page']);
            $notifications = $this->notificationService->getUserNotifications($request->user(), $filters);

            return response()->json([
                'status'  => 'success',
                'message' => 'Daftar notifikasi berhasil diambil.',
                'data'    => $notifications->items(),
                'meta'    => [
                    'current_page' => $notifications->currentPage(),
                    'last_page'    => $notifications->lastPage(),
                    'per_page'     => $notifications->perPage(),
                    'total'        => $notifications->total(),
                    'unread_count' => $request->user()->notifications()->where('is_read', false)->count(),
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Terjadi kesalahan saat mengambil notifikasi.'
            ], 500);
        }
    }

    /**
     * PATCH /api/notifications/{id}/read
     * Menandai satu notifikasi telah dibaca
     */
    public function markAsRead(Request $request, int $id): JsonResponse
    {
        try {
            $notification = $this->notificationService->markAsRead($id, $request->user());

            return response()->json([
                'status'  => 'success',
                'message' => 'Notifikasi ditandai telah dibaca.',
                'data'    => $notification
            ], 200);

        } catch (NotFoundHttpException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 404);
        } catch (AuthorizationException $e) {
            return response()->json(['status' => 'forbidden', 'message' => $e->getMessage()], 403);
        }
    }

    /**
     * PATCH /api/notifications/read-all
     * Menandai semua notifikasi telah dibaca
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        try {
            $updatedCount = $this->notificationService->markAllAsRead($request->user());

            return response()->json([
                'status'  => 'success',
                'message' => "Berhasil menandai $updatedCount notifikasi sebagai telah dibaca.",
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Terjadi kesalahan sistem.'
            ], 500);
        }
    }

    /**
     * DELETE /api/notifications/{id}
     * Menghapus notifikasi
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $this->notificationService->deleteNotification($id, $request->user());

            return response()->json([
                'status'  => 'success',
                'message' => 'Notifikasi berhasil dihapus.'
            ], 200);

        } catch (NotFoundHttpException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 404);
        } catch (AuthorizationException $e) {
            return response()->json(['status' => 'forbidden', 'message' => $e->getMessage()], 403);
        }
    }
}