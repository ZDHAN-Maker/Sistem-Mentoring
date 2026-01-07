<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    /**
     * Membuat notifikasi baru untuk user.
     * - Mendukung relasi polymorphic (notifiable)
     * - Semua notifikasi baru otomatis berstatus "unread"
     */
    public function createNotification($userId, $title, $message, $type = 'general', $notifiable = null)
    {
        return Notification::create([
            'user_id'         => $userId,
            'type'            => $type,
            'title'           => $title,
            'message'         => $message,
            'status'          => 'unread',
            'notifiable_id'   => $notifiable?->id,
            'notifiable_type' => $notifiable ? get_class($notifiable) : null,
        ]);
    }

    /**
     * Mengambil semua notifikasi milik user (urut terbaru).
     */
    public function getUserNotifications($userId)
    {
        return Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Menandai notifikasi sebagai "read".
     */
    public function markAsRead($notificationId)
    {
        $notification = Notification::findOrFail($notificationId);
        $notification->update(['status' => 'read']);

        return $notification;
    }

    /**
     * Menghapus satu notifikasi.
     */
    public function deleteNotification($notificationId)
    {
        $notification = Notification::findOrFail($notificationId);
        $notification->delete();

        return true;
    }
}
