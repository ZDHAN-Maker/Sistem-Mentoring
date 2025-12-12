<?php

namespace App\Http\Controllers;

use App\Services\MentorService;
use Illuminate\Http\Request;
use App\Events\TaskAssigned;
use App\Events\TaskSubmitted;
use App\Events\FeedbackGiven;
use App\Events\PairingCreated;
use App\Events\MentoringScheduled;
use App\Models\User;

class MentorController extends Controller
{
    protected $mentorService;

    public function __construct(MentorService $mentorService)
    {
        $this->mentorService = $mentorService;
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
        $request->validate([
            'pairing_id' => 'required|exists:pairings,id',
            'mentee_id'  => 'required|exists:users,id',
            'judul'      => 'required|string',
            'deskripsi'  => 'nullable|string',
        ]);

        $task = $this->mentorService->giveTask($mentorId, $request->all());

        event(new TaskAssigned(User::find($mentorId), User::find($request->mentee_id)));

        return response()->json([
            'message' => 'Tugas berhasil diberikan.',
            'task'    => $task
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
        $request->validate(['file_path' => 'required|string']);

        return response()->json([
            'message'  => 'Materi berhasil diupload.',
            'material' => $this->mentorService->uploadMaterial($mentorId, $request->all())
        ]);
    }

    public function createPairing(Request $request)
    {
        $request->validate([
            'mentor_id' => 'required|exists:users,id',
            'mentee_id' => 'required|exists:users,id',
        ]);

        $pairing = $this->mentorService->createPairing($request->all());

        event(new PairingCreated(
            User::find($request->mentor_id),
            User::find($request->mentee_id)
        ));

        return response()->json([
            'message' => 'Pairing berhasil dibuat.',
            'pairing' => $pairing
        ]);
    }

    public function scheduleMentoring(Request $request)
    {
        $request->validate([
            'mentor_id' => 'required|exists:users,id',
            'mentee_id' => 'required|exists:users,id',
            'schedule_date' => 'required|date',
        ]);

        $schedule = $this->mentorService->scheduleMentoring($request->all());

        event(new MentoringScheduled(
            User::find($request->mentor_id),
            User::find($request->mentee_id),
            $request->schedule_date
        ));

        return response()->json([
            'message'  => 'Jadwal mentoring dibuat.',
            'schedule' => $schedule
        ]);
    }

    public function getDashboard($mentorId)
    {
        return response()->json([
            'status' => 'success',
            'data'   => $this->mentorService->getMentorDashboard($mentorId),
        ]);
    }
}
