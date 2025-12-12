<?php

namespace App\Listeners;

use App\Services\NotificationService;

class SendPairingNotification
{
    protected $notif;

    public function __construct(NotificationService $notif)
    {
        $this->notif = $notif;
    }

    public function handle($event)
    {
        // Untuk mentor
        $this->notif->createNotification(
            $event->mentor->id,
            "Anda mendapatkan mentee baru.",
            "pairing"
        );

        // Untuk mentee
        $this->notif->createNotification(
            $event->mentee->id,
            "Anda mendapatkan mentor baru.",
            "pairing"
        );
    }
}
