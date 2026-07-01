<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Pemetaan Event dan Listener untuk seluruh sistem mentoring.
     * Semua Listener di bawah ini wajib mengimplementasikan ShouldQueue agar anti-overload.
     */
    protected $listen = [
        // --- MODUL TASK ---
        \App\Events\TaskPublished::class => [
            \App\Listeners\SendTaskNotification::class,
        ],

        // --- MODUL SCHEDULE (Jadwal) ---
        \App\Events\ScheduleCreated::class => [
            \App\Listeners\SendScheduleCreatedNotification::class,
        ],
        \App\Events\ScheduleUpdated::class => [
            \App\Listeners\SendScheduleUpdatedNotification::class,
        ],
        // --- MODUL SUBMISSION (Baru) ---
        \App\Events\SubmissionSubmitted::class => [
            \App\Listeners\SendSubmissionSubmittedNotification::class,
        ],
        \App\Events\SubmissionReviewed::class => [
            \App\Listeners\SendSubmissionReviewedNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        parent::boot();
    }
}
