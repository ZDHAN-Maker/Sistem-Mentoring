<?php

namespace App\Listeners;

use App\Services\NotificationService;

class SendTaskSubmittedNotification
{
    protected $notif;

    public function __construct(NotificationService $notif)
    {
        $this->notif = $notif;
    }

    public function handle($event)
    {
        $this->notif->createNotification(
            userId: $event->mentor->id,
            title: "Tugas Telah Dikumpulkan",
            message: "Mentee Anda telah mengumpulkan tugas.",
            type: "submission",
            notifiable: $event->task
        );
    }
}
