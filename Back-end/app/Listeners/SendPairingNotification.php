<?php

namespace App\Listeners;

use App\Events\PairingCreated;
use App\Services\NotificationService;

class SendPairingNotification
{
    protected $notif;

    public function __construct(NotificationService $notif)
    {
        $this->notif = $notif;
    }

    public function handle(PairingCreated $event)
    {
        // mentor
        $this->notif->createNotification(
            userId: $event->mentor->id,
            title: "Pairing Baru",
            message: "Anda mendapatkan mentee baru.",
            type: "pairing",
            notifiable: $event->pairing
        );

        // mentee
        $this->notif->createNotification(
            userId: $event->mentee->id,
            title: "Pairing Baru",
            message: "Anda mendapatkan mentor baru.",
            type: "pairing",
            notifiable: $event->pairing
        );
    }
}
