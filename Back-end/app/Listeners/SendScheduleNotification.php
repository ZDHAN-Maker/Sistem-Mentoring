<?php

namespace App\Listeners;

use App\Services\NotificationService;

class SendScheduleNotification
{
    protected $notif;

    public function __construct(NotificationService $notif)
    {
        $this->notif = $notif;
    }

    public function handle($event)
    {
        $date = $event->date;

        // untuk mentor
        $this->notif->createNotification(
            userId: $event->mentor->id,
            title: "Jadwal Mentoring Baru",
            message: "Sesi mentoring dijadwalkan pada: {$date}",
            type: "schedule",
            notifiable: $event->schedule ?? null
        );

        // untuk mentee
        $this->notif->createNotification(
            userId: $event->mentee->id,
            title: "Jadwal Mentoring Baru",
            message: "Sesi mentoring dijadwalkan pada: {$date}",
            type: "schedule",
            notifiable: $event->schedule ?? null
        );
    }
}
