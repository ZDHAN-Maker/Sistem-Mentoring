<?php

namespace App\Listeners;

use App\Events\ScheduleCreated;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendScheduleCreatedNotification implements ShouldQueue
{
    use InteractsWithQueue;

    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(ScheduleCreated $event): void
    {
        $schedule = $event->schedule;
        
        // Asumsi model Schedule terhubung dengan model Pairing untuk mendapatkan data Mentee
        $mentee = $schedule->pairing->mentee; 
        $formattedDate = $schedule->schedule_date->format('d M Y, H:i');

        // Kirim notifikasi ke Mentee bahwa Mentor telah mengatur jadwal baru
        $this->notificationService->sendNotification(
            $mentee,
            "Jadwal Bimbingan Baru",
            "Mentor Anda telah menjadwalkan sesi bimbingan baru pada tanggal {$formattedDate} WIB.",
            'schedule_created',
            $schedule
        );
    }
}