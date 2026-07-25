<?php
namespace App\Listeners;

use App\Events\SubmissionSubmitted;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendSubmissionSubmittedNotification implements ShouldQueue
{
    use InteractsWithQueue;

    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(SubmissionSubmitted $event): void
    {
        $submission = $event->submission;
        
        // Tarik data mentor penerima via relasi task -> pairing -> mentor
        $mentor = $submission->task->pairing->mentor;
        $menteeName = $submission->mentee->name;
        $taskTitle = $submission->task->title;

        // Kirim notifikasi ke Mentor
        $this->notificationService->sendNotification(
            $mentor,
            "Submission Tugas Baru",
            "{$menteeName} telah mengumpulkan tugas '{$taskTitle}'. Silakan lakukan pemeriksaan dan penilaian.",
            'submission_submitted',
            $submission
        );
    }
}