<?php

namespace App\Services;

use App\Models\CalendarSync;

class CalendarSyncService
{
    /**
     * Sinkronisasi jadwal ke Google Calendar (dummy untuk sekarang)
     */
    public function sync(array $data)
    {
        // Simpan ke tabel CalendarSync
        $calendar = CalendarSync::create([
            'user_id'        => $data['user_id'],
            'schedule_id'    => $data['schedule_id'],
            'google_event_id'=> $data['google_event_id'] ?? null,
            'status'         => $data['status'] ?? 'pending',
        ]);

        return $calendar;
    }

    /**
     * Update status sinkronisasi
     */
    public function updateStatus($id, $status)
    {
        $calendar = CalendarSync::findOrFail($id);
        $calendar->status = $status;
        $calendar->save();

        return $calendar;
    }

    /**
     * Ambil daftar sinkronisasi berdasarkan user
     */
    public function getByUser($userId)
    {
        return CalendarSync::where('user_id', $userId)->get();
    }
}
