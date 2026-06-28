<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreScheduleRequest;
use App\Models\Schedule;
use App\Models\Pairing;
use App\Services\ScheduleService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ScheduleController extends Controller
{
    protected $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    /**
     * GET: Melihat jadwal berdasarkan Pairing.
     * Baik Mentor maupun Mentee bisa mengakses ini, asalkan mereka bagian dari Pairing tersebut.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Ambil semua jadwal di mana user menjadi Mentor ATAU Mentee melalui relasi Pairing
        $schedules = Schedule::whereHas('pairing', function ($query) use ($user) {
            $query->where('mentor_id', $user->id)
                  ->orWhere('mentee_id', $user->id);
        })->with('pairing:id,mentor_id,mentee_id') // Load data relasi yang relevan
          ->orderBy('start_time', 'asc')
          ->get();

        return response()->json([
            'status' => 'success',
            'data' => $schedules
        ], 200);
    }

    /**
     * POST: Mentor membuat jadwal baru
     */
    public function store(StoreScheduleRequest $request)
    {
        try {
            $user = Auth::user();
            $schedule = $this->scheduleService->createSchedule($request->validated(), $user);

            return response()->json([
                'status' => 'success',
                'message' => 'Jadwal mentoring berhasil dibuat.',
                'data' => $schedule
            ], 201);

        } catch (Exception $e) {
            $statusCode = $e->getCode() === 403 ? 403 : 400;
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }

    /**
     * PUT/PATCH: Mentor mengubah jadwal
     */
    public function update(StoreScheduleRequest $request, Schedule $schedule)
    {
        try {
            $user = Auth::user();
            $updatedSchedule = $this->scheduleService->updateSchedule($schedule, $request->validated(), $user);

            return response()->json([
                'status' => 'success',
                'message' => 'Jadwal mentoring berhasil diperbarui.',
                'data' => $updatedSchedule
            ], 200);

        } catch (Exception $e) {
            $statusCode = $e->getCode() === 403 ? 403 : 400;
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }

    /**
     * PATCH: Mentor mengubah status jadwal (completed/canceled)
     */
    public function updateStatus(Request $request, Schedule $schedule)
    {
        $request->validate(['status' => 'required|string']);

        try {
            $user = Auth::user();
            $updatedSchedule = $this->scheduleService->updateStatus($schedule, $request->status, $user);

            return response()->json([
                'status' => 'success',
                'message' => 'Status jadwal berhasil diperbarui.',
                'data' => $updatedSchedule
            ], 200);

        } catch (Exception $e) {
            $statusCode = $e->getCode() === 403 ? 403 : 400;
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }

    /**
     * DELETE: Mentor menghapus jadwal
     */
    public function destroy(Schedule $schedule)
    {
        try {
            $user = Auth::user();
            $this->scheduleService->deleteSchedule($schedule, $user);

            return response()->json([
                'status' => 'success',
                'message' => 'Jadwal mentoring berhasil dihapus.'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], $e->getCode() === 403 ? 403 : 400);
        }
    }
}