<?php

namespace App\Listeners;

use App\Events\ScheduleUpdated;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendScheduleUpdatedNotification implements ShouldQueue
{
    use InteractsWithQueue;

    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(ScheduleUpdated $event): void
    {
        $schedule = $event->schedule;
        $mentee = $schedule->pairing->mentee;
        $formattedDate = $schedule->schedule_date->format('d M Y, H:i');

        // Kirim notifikasi ke Mentee bahwa ada perubahan jadwal bimbingan
        $this->notificationService->sendNotification(
            $mentee,
            "Perubahan Jadwal Bimbingan",
            "Sesi bimbingan Anda telah diubah oleh Mentor menjadi tanggal {$formattedDate} WIB. Silakan periksa kembali.",
            'schedule_updated',
            $schedule
        );
    }
}