<?php

namespace App\Listeners;

use App\Events\SubmissionReviewed;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendSubmissionReviewedNotification implements ShouldQueue
{
    use InteractsWithQueue;

    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(SubmissionReviewed $event): void
    {
        $submission = $event->submission;
        
        // Tarik data mentee langsung dari properti submission
        $mentee = $submission->mentee;
        $taskTitle = $submission->task->title;
        $grade = number_format($submission->grade, 1);

        // Kirim notifikasi balik ke Mentee
        $this->notificationService->sendNotification(
            $mentee,
            "Tugas Anda Telah Dinilai",
            "Tugas '{$taskTitle}' telah diperiksa oleh Mentor. Nilai Anda: {$grade}.",
            'submission_reviewed',
            $submission
        );
    }
}