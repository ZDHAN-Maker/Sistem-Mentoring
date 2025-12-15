<?php

namespace App\Listeners;

use App\Services\NotificationService;

class SendFeedbackNotification
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
            title: "Feedback Baru dari Mentor",
            message: "Mentor memberikan feedback pada tugas Anda.",
            type: "feedback",
            notifiable: $event->task ?? null
        );
    }
}
