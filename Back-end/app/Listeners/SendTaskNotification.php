<?php

namespace App\Listeners;

use App\Events\TaskPublished;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;

// 2. TAMBAHKAN "implements ShouldQueue" di ujung nama class
class SendTaskNotification implements ShouldQueue 
{
    protected $notificationService;

    // Anda bahkan bisa mengatur berapa kali antrean ini dicoba ulang jika gagal
    public $tries = 3; 

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(TaskPublished $event): void
    {
        $task = $event->task;
        $mentee = $task->pairing->mentee;

        // Proses ini sekarang berjalan di background, tidak membebani performa klik user!
        $this->notificationService->sendNotification(
            $mentee,
            "Tugas Baru: {$task->title}",
            "Mentor Anda telah menerbitkan tugas baru.",
            'new_task',
            $task
        );
    }
}