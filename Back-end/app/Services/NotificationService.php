<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Buat notifikasi baru untuk user
     */
    public function createNotification($userId, $message, $type = 'general')
    {
        return Notification::create([
            'user_id' => $userId,
            'message' => $message,
            'type'    => $type,
            'status'  => 'unread',
        ]);
    }

    /**
     * Ambil semua notifikasi user
     */
    public function getUserNotifications($userId)
    {
        return Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Tandai notifikasi sebagai dibaca
     */
    public function markAsRead($notificationId)
    {
        $notification = Notification::findOrFail($notificationId);
        $notification->status = 'read';
        $notification->save();

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
