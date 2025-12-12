<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    /**
     * Membuat notifikasi baru (mendukung polymorphic)
     */
    public function createNotification($userId, $title, $message, $type = 'general', $notifiable = null)
    {
        return Notification::create([
            'user_id'        => $userId,
            'type'           => $type,
            'title'          => $title,
            'message'        => $message,
            'status'         => 'unread',
            'notifiable_id'   => $notifiable?->id,
            'notifiable_type' => $notifiable ? get_class($notifiable) : null,
        ]);
    }

    /**
     * Ambil semua notifikasi milik user
     */
    public function getUserNotifications($userId)
    {
        return Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Tandai notifikasi sebagai read
     */
    public function markAsRead($notificationId)
    {
        $notification = Notification::findOrFail($notificationId);
        $notification->update(['status' => 'read']);

        return $notification;
    }

    /**
     * Hapus notifikasi
     */
    public function deleteNotification($notificationId)
    {
        $notification = Notification::findOrFail($notificationId);
        $notification->delete();

        return true;
    }
}
