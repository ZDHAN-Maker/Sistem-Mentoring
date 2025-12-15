<?php

namespace App\Listeners;

use App\Services\NotificationService;

class SendTaskAssignedNotification
{
    protected $notif;

    public function __construct(NotificationService $notif)
    {
        $this->notif = $notif;
    }

    public function handle($event)
    {
        $this->notif->createNotification(
            userId: $event->mentee->id,
            title: "Tugas Baru dari Mentor",
            message: "Mentor memberikan tugas baru kepada Anda.",
            type: "task",
            notifiable: $event->task
        );
    }
}
