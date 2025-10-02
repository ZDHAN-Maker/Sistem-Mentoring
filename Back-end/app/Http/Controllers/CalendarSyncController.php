<?php

namespace App\Http\Controllers;

use App\Services\CalendarSyncService;
use Illuminate\Http\Request;

class CalendarSyncController extends Controller
{
    protected $calendarSyncService;

    public function __construct(CalendarSyncService $calendarSyncService)
    {
        $this->calendarSyncService = $calendarSyncService;
    }

    /**
     * Sinkronisasi jadwal ke Google Calendar
     */
    public function sync(Request $request)
    {
        $request->validate([
            'user_id'      => 'required|exists:users,id',
            'schedule_id'  => 'required|exists:schedules,id',
            'google_event_id' => 'nullable|string',
        ]);

        $calendar = $this->calendarSyncService->sync($request->all());

        return response()->json([
            'message'  => 'Sinkronisasi jadwal berhasil',
            'calendar' => $calendar
        ], 201);
    }

    /**
     * Update status sinkronisasi
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,synced,failed'
        ]);

        $calendar = $this->calendarSyncService->updateStatus($id, $request->status);

        return response()->json([
            'message'  => 'Status sinkronisasi diperbarui',
            'calendar' => $calendar
        ]);
    }

    /**
     * Ambil daftar sinkronisasi berdasarkan user
     */
    public function getByUser($userId)
    {
        $calendars = $this->calendarSyncService->getByUser($userId);

        return response()->json($calendars);
    }
}
