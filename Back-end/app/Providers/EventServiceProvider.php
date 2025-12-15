<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Event -> Listener Mapping
     */
    protected $listen = [
        \App\Events\TaskAssigned::class => [
            \App\Listeners\SendTaskAssignedNotification::class,
        ],

        \App\Events\TaskSubmitted::class => [
            \App\Listeners\SendTaskSubmittedNotification::class,
        ],

        \App\Events\FeedbackGiven::class => [
            \App\Listeners\SendFeedbackNotification::class,
        ],

        \App\Events\PairingCreated::class => [
            \App\Listeners\SendPairingNotification::class,
        ],

        \App\Events\MentoringScheduled::class => [
            \App\Listeners\SendScheduleNotification::class,
        ],
    ];

    /**
     * Register events & listeners
     */
    public function boot(): void
    {
        //
    }

    /**
     * Laravel opsi tambahan (tidak wajib dipakai)
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
