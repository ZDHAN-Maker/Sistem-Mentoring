<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Database\Eloquent\Model;

class NotificationService
{
    /**
     * FUNGSI INTERNAL: Mengirim notifikasi (Dipanggil oleh Service lain, bukan dari Controller API)
     * Contoh: TaskService memanggil fungsi ini setelah tugas baru dibuat.
     */
    public function sendNotification(User $user, string $title, string $message, string $type, Model $reference = null): Notification
    {
        return Notification::create([
            'user_id'        => $user->id,
            'title'          => $title,
            'message'        => $message,
            'type'           => $type,
            'reference_type' => $reference ? get_class($reference) : null,
            'reference_id'   => $reference ? $reference->getKey() : null,
            'is_read'        => false,
        ]);
    }

    /**
     * API: Mengambil daftar notifikasi milik user yang sedang login
     */
    public function getUserNotifications(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = Notification::where('user_id', $user->id)
                             ->with('reference'); // Otomatis me-load entitas terkait (Task/Schedule/dll)

        // Filter: Hanya tampilkan yang belum dibaca jika diminta
        if (isset($filters['unread_only']) && filter_var($filters['unread_only'], FILTER_VALIDATE_BOOLEAN)) {
            $query->where('is_read', false);
        }

        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }

    /**
     * API: Menandai satu notifikasi spesifik sebagai telah dibaca
     */
    public function markAsRead(int $id, User $user): Notification
    {
        $notification = Notification::find($id);

        if (!$notification) {
            throw new NotFoundHttpException('Notifikasi tidak ditemukan.');
        }

        if ($notification->user_id !== $user->id) {
            throw new AuthorizationException('Anda tidak memiliki akses untuk notifikasi ini.');
        }

        if (!$notification->is_read) {
            $notification->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }

        return $notification;
    }

    /**
     * API: Menandai SEMUA notifikasi milik user sebagai telah dibaca
     */
    public function markAllAsRead(User $user): int
    {
        // Mengembalikan jumlah baris (notifikasi) yang diupdate
        return Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    /**
     * API: Menghapus satu notifikasi (opsional, jika user ingin membersihkan riwayat)
     */
    public function deleteNotification(int $id, User $user): void
    {
        $notification = Notification::find($id);

        if (!$notification) {
            throw new NotFoundHttpException('Notifikasi tidak ditemukan.');
        }

        if ($notification->user_id !== $user->id) {
            throw new AuthorizationException('Anda tidak memiliki akses untuk notifikasi ini.');
        }

        $notification->delete();
    }
}