<?php

namespace App\Observers;

use App\Models\Schedule;
use App\Services\GoogleService;
use Google\Service\Calendar\Event;

class ScheduleObserver
{
    public function __construct(private GoogleService $google) {}

    public function created(Schedule $schedule): void
    {
        if (!$schedule->user_id) return;

        $calendar = $this->google->clientForUser($schedule->user_id);

        $event = new Event([
            'summary' => $schedule->title,
            'description' => $schedule->description,
            'start' => ['dateTime' => $schedule->start_at->toRfc3339String()],
            'end'   => ['dateTime' => $schedule->end_at->toRfc3339String()],
        ]);

        $created = $calendar->events->insert($schedule->google_calendar_id ?? 'primary', $event);
        $schedule->update(['google_event_id' => $created->id]);
    }

    public function updated(Schedule $schedule): void
    {
        if (!$schedule->user_id || !$schedule->google_event_id) return;

        $calendar = $this->google->clientForUser($schedule->user_id);
        $event = $calendar->events->get($schedule->google_calendar_id ?? 'primary', $schedule->google_event_id);

        $event->setSummary($schedule->title);
        $event->setDescription($schedule->description);
        $event->setStart(['dateTime' => $schedule->start_at->toRfc3339String()]);
        $event->setEnd(['dateTime' => $schedule->end_at->toRfc3339String()]);

        $calendar->events->update($schedule->google_calendar_id ?? 'primary', $event->id, $event);
    }

    public function deleted(Schedule $schedule): void
    {
        if (!$schedule->user_id || !$schedule->google_event_id) return;

        $calendar = $this->google->clientForUser($schedule->user_id);
        $calendar->events->delete($schedule->google_calendar_id ?? 'primary', $schedule->google_event_id);
    }
}
