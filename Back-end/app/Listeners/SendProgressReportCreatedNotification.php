<?php

namespace App\Listeners;

use App\Events\ProgressReportCreated;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendProgressReportCreatedNotification implements ShouldQueue
{
    use InteractsWithQueue;

    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(ProgressReportCreated $event): void
    {
        $report = $event->progressReport;
        
        // Mengambil data mentee tujuan berdasarkan relasi pairing
        $mentee = $report->pairing->mentee;
        $title = $report->title ?? "Evaluasi Berkala";

        // Kirim notifikasi ke Mentee
        $this->notificationService->sendNotification(
            $mentee,
            "Laporan Penilaian Baru Diterbitkan",
            "Mentor Anda telah merilis laporan perkembangan baru: '{$title}'. Silakan periksa nilai evaluasi Anda.",
            'progress_report_created',
            $report
        );
    }
}