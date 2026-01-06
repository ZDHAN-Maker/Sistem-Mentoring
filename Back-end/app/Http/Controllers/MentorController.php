<?php

namespace App\Http\Controllers;

use App\Services\MentorService;
use Illuminate\Http\Request;
use App\Services\LearningActivityService;
use App\Events\FeedbackGiven;
use App\Services\SubmissionService;

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
        return response()->json(
            $this->mentorService->getMentorById($id)
        );
    }

    public function mentees()
    {
        $mentor = auth()->user();

        if ($mentor->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(
            $this->mentorService->getMentorMentees($mentor->id)
        );
    }


    public function schedules($id)
    {
        return response()->json($this->mentorService->getMentorSchedules($id));
    }

    public function giveTask(Request $request, MentorTaskService $service)
    {
        $user = auth()->user();

        if ($user->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'pairing_id' => 'required|exists:pairings,id',
            'judul'      => 'required|string|max:255',
            'deskripsi'  => 'nullable|string',
            'type'       => 'required|in:file,video,link',

            'file_path'  => 'required_if:type,file|file|max:10240',
            'link_url'   => 'required_if:type,link|required_if:type,video|url'
        ]);

        $task = $service->giveTask($user->id, $validated, $request);

        return response()->json([
            'message' => 'Tugas berhasil diberikan',
            'task'    => $task
        ], 201);
    }

    public function giveFeedback(Request $request, $reportId)
    {
        $request->validate([
            'feedback' => 'required|string'
        ]);

        $report = $this->mentorService->giveFeedback(
            auth()->id(),
            $reportId,
            $request->feedback
        );

        // ambil mentee dari relasi pairing
        $mentee = $report->pairing->mentee;

        if ($mentee) {
            event(new FeedbackGiven(auth()->user(), $mentee));
        }

        return response()->json([
            'message' => 'Feedback berhasil dikirim.',
            'report'  => $report
        ]);
    }



    public function uploadMaterial(Request $request)
    {
        $mentor = auth()->user();

        if ($mentor->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title'                => 'required|string|max:255',
            'type'                 => 'required|in:video,file,link',

            'video' => 'required_if:type,video|file|mimes:mp4,mkv,avi|max:512000',
            'link_url' => 'required_if:type,link|url',

            'duration' => 'nullable|integer'
        ]);


        $material = $this->mentorService->uploadMaterial(
            $mentor->id,
            $validated,
            $request
        );

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
            'start_time' => 'required|date',
            'end_time'   => 'nullable|date|after:start_time',
        ]);

        $schedule = $this->mentorService->scheduleMentoring($request->all());

        return response()->json([
            'message'  => 'Jadwal mentoring berhasil dibuat',
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

    /**
     * Dashboard mentor
     */
    public function dashboard()
    {
        $mentor = auth()->user();

        if ($mentor->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'dashboard' => $this->mentorService->getMentorDashboard($mentor->id),
            'pairings'  => $this->mentorService->getMentorPairings($mentor->id),
        ]);
    }

    public function updateSchedule(Request $request, $id)
    {
        $mentor = auth()->user();

        if ($mentor->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'start_time' => 'nullable|date',
            'end_time'   => 'nullable|date|after:start_time',
            'status'     => 'nullable|in:planned,ongoing,done',
        ]);

        $schedule = $this->mentorService->updateSchedule(
            $mentor->id,
            $id,
            $request->all()
        );

        return response()->json([
            'message'  => 'Jadwal berhasil diperbarui',
            'schedule' => $schedule
        ]);
    }

    public function deleteSchedule($id)
    {
        $mentor = auth()->user();

        if ($mentor->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->mentorService->deleteSchedule($mentor->id, $id);

        return response()->json([
            'message' => 'Jadwal berhasil dihapus'
        ]);
    }

    public function reports()
    {
        $mentor = auth()->user();

        if ($mentor->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(
            $this->mentorService->getMyMenteesReports($mentor->id),
            200
        );
    }

    public function Submission(Request $request, SubmissionService $service)
    {
        $user = auth()->user();

        if ($user->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $submissions = $service->listSubmissionsForMentor(
            $user->id,
            $request->pairing_id
        );

        return response()->json([
            'data' => $submissions
        ]);
    }


    public function grade(Request $request, $id, SubmissionService $service)
    {
        $user = auth()->user();

        if ($user->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'grade'  => 'required|integer|min:0|max:100',
            'status' => 'required|in:reviewed,graded'
        ]);

        $submission = $service->gradeSubmission($user->id, $id, $validated);

        return response()->json([
            'message' => 'Submission berhasil dinilai',
            'submission' => $submission
        ]);
    }
}
