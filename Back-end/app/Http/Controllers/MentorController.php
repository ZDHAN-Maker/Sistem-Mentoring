<?php

namespace App\Http\Controllers;

use App\Services\MentorService;
use Illuminate\Http\Request;
use App\Models\Material;
use App\Events\TaskAssigned;
use App\Services\LearningActivityService;
use App\Events\TaskSubmitted;
use App\Events\FeedbackGiven;
use App\Events\PairingCreated;
use App\Events\MentoringScheduled;
use App\Models\User;

class MentorController extends Controller
{
    protected $mentorService;
    protected $learningActivityService;

    public function __construct(
        MentorService $mentorService,
        LearningActivityService $learningActivityService
    ) {
        $this->mentorService = $mentorService;
        $this->learningActivityService = $learningActivityService;
    }

    public function index()
    {
        return response()->json($this->mentorService->getAllMentors());
    }

    public function show($id)
    {
        return response()->json($this->mentorService->getMentorById($id));
    }

    public function mentees($id)
    {
        return response()->json($this->mentorService->getMentorMentees($id));
    }

    public function schedules($id)
    {
        return response()->json($this->mentorService->getMentorSchedules($id));
    }

    public function giveTask(Request $request, $mentorId)
    {
        if (auth()->id() !== (int) $mentorId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'pairing_id' => 'required|exists:pairings,id',
            'judul'      => 'required|string',
            'deskripsi'  => 'nullable|string',
        ]);

        $task = $this->mentorService->giveTask($mentorId, $request->all());

        return response()->json([
            'message' => 'Tugas berhasil diberikan',
            'task' => $task
        ]);
    }


    public function giveFeedback(Request $request, $reportId)
    {
        $request->validate(['feedback' => 'required|string']);

        $report = $this->mentorService->giveFeedback($reportId, $request->feedback);

        event(new FeedbackGiven(auth()->user(), User::find($report->mentee_id)));

        return response()->json([
            'message' => 'Feedback berhasil dikirim.',
            'report'  => $report
        ]);
    }

    public function uploadMaterial(Request $request, $mentorId)
    {
        // 🔐 mentor hanya upload atas nama dirinya
        if (auth()->id() !== (int) $mentorId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'learning_activity_id' => 'required|exists:learning_activities,id',
            'title'                => 'required|string|max:255',
            'video_path'           => 'required|string'
        ]);

        $material = Material::create([
            'learning_activity_id' => $request->learning_activity_id,
            'mentor_id'            => $mentorId,
            'title'                => $request->title,
            'video_path'           => $request->video_path,
            'status'               => 'published'
        ]);

        return response()->json([
            'message'  => 'Materi berhasil diupload.',
            'material' => $material
        ], 201);
    }


    public function createPairing(Request $request)
    {
        $request->validate([
            'mentor_id' => 'required|exists:users,id,role,mentor',
            'mentee_id' => 'required|exists:users,id,role,mentee',
        ]);

        $pairing = $this->mentorService->createPairing($request->all());

        return response()->json([
            'message' => 'Pairing berhasil dibuat',
            'pairing' => $pairing
        ], 201);
    }


    public function scheduleMentoring(Request $request)
    {
        $request->validate([
            'pairing_id' => 'required|exists:pairings,id',
            'schedule_date' => 'required|date',
        ]);

        $schedule = $this->mentorService->scheduleMentoring($request->all());

        return response()->json([
            'message' => 'Jadwal mentoring berhasil dibuat',
            'schedule' => $schedule
        ], 201);
    }


    public function getDashboard($mentorId)
    {
        return response()->json([
            'status' => 'success',
            'data'   => $this->mentorService->getMentorDashboard($mentorId),
        ]);
    }
}
