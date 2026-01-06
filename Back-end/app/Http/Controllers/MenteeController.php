<?php

namespace App\Http\Controllers;

use App\Services\MenteeService;
use App\Services\SubmissionService;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\Schedule;
use Illuminate\Validation\ValidationException;

class MenteeController extends Controller
{
    protected $menteeService;

    public function __construct(MenteeService $menteeService)
    {
        $this->menteeService = $menteeService;
    }

    /**
     * Ambil semua mentee (khusus admin/mentor)
     */
    public function index()
    {
        return response()->json(
            $this->menteeService->getAllMentees(),
            200
        );
    }

    /**
     * Detail mentee
     */
    public function show($id)
    {
        try {
            return response()->json(
                $this->menteeService->getMenteeById($id),
                200
            );
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Mentee tidak ditemukan'], 404);
        }
    }

    /**
     * Semua laporan perkembangan mentee
     */
    public function reports($id)
    {
        return response()->json(
            $this->menteeService->getMenteeReports($id),
            200
        );
    }

    /**
     * Semua task milik mentee
     */
    public function tasks($id)
    {
        return response()->json([
            'data' => $this->menteeService->getMenteeTasks($id)
        ], 200);
    }

    /**
     * Jadwal mentee
     */
    public function schedules($id)
    {
        $schedules = Schedule::whereHas('pairing', function ($q) use ($id) {
            $q->where('mentee_id', $id);
        })
            ->orderBy('start_time', 'asc') 
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Mentee schedules fetched successfully',
            'data' => $schedules
        ]);
    }

    /**
     * Dashboard mentee
     */
    public function dashboard()
    {
        $mentee = auth()->user();

        return response()->json([
            'stats' => $this->menteeService->getDashboardStats($mentee->id),
            'pairings' => $this->menteeService->getMenteePairings($mentee->id),
            'upcoming_schedules' => $this->menteeService->getUpcomingSchedules($mentee->id),
        ]);
    }

    /**
     * List semua materi milik mentee
     */
    public function materials()
    {
        $menteeId = auth()->id();

        return response()->json([
            'data' => $this->menteeService->getMenteeMaterials($menteeId)
        ]);
    }


    /**
     * Semua aktivitas belajar mentee
     */
    public function learningActivities()
    {
        $mentee = auth()->user();

        return response()->json(
            $this->menteeService->getMenteeActivities($mentee->id)
        );
    }

    /**
     * Mentor dari mentee ini
     */
    public function myMentor()
    {
        $mentee = auth()->user();

        return response()->json([
            'data' => $this->menteeService->getMyMentor($mentee->id)
        ]);
    }

    public function myTasks(MenteeService $service)
    {
        $user = auth()->user();

        if ($user->role !== 'mentee') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $tasks = $service->getMyTasks($user->id);

        return response()->json([
            'tasks' => $tasks
        ]);
    }

    /**
     * Track aktivitas (view, open, watch)
     */
    public function trackActivity(Request $request, $materialId)
    {
        $mentee = auth()->user();

        $request->validate([
            'action' => 'required|in:open,watch,complete'
        ]);

        $this->menteeService->recordActivity(
            $mentee->id,
            $materialId,
            $request->action
        );

        return response()->json(['message' => 'Activity recorded']);
    }

    /**
     * Update durasi progress menonton video
     */
    public function updateWatchProgress(Request $request, $materialId)
    {
        $mentee = auth()->user();

        $request->validate([
            'duration' => 'required|integer|min:0'
        ]);

        $progress = $this->menteeService->updateMaterialWatchProgress(
            $mentee->id,
            $materialId,
            $request->duration
        );


        return response()->json([
            'message' => 'Progress updated',
            'data' => $progress
        ]);
    }

    /**
     * Semua progress materi
     */
    public function materialProgress()
    {
        $mentee = auth()->user();

        return response()->json([
            'data' => $this->menteeService->getMenteeMaterialProgress($mentee->id)
        ]);
    }

    /**
     * Aktivitas berdasarkan LearningActivity tertentu
     */
    public function activityByLearningActivity($learningActivityId)
    {
        $mentee = auth()->user();

        return response()->json(
            $this->menteeService->getActivitiesByLearningActivity(
                $mentee->id,
                $learningActivityId
            )
        );
    }

    /**
     * Statistik pembelajaran mentee
     */
    public function learningStats()
    {
        $mentee = auth()->user();

        return response()->json(
            $this->menteeService->getMenteeLearningStats($mentee->id)
        );
    }

    public function submit(Request $request, $taskId, SubmissionService $service)
    {
        $user = auth()->user();

        if ($user->role !== 'mentee') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $submission = $service->submitTask($user->id, $taskId, $request);

            return response()->json([
                'message' => 'Tugas berhasil dikumpulkan',
                'submission' => $submission
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
