<?php

namespace App\Http\Controllers;

use App\Services\MentorService;
use Illuminate\Http\Request;

class MentorController extends Controller
{
    protected MentorService $mentorService;

    public function __construct(MentorService $mentorService)
    {
        $this->mentorService = $mentorService;
    }

    public function index()
    {
        $mentors = $this->mentorService->getAllMentors();
        return response()->json($mentors);
    }

    public function show($id)
    {
        $mentor = $this->mentorService->getMentorById($id);
        return response()->json($mentor);
    }

    public function mentees($id)
    {
        $mentees = $this->mentorService->getMentorMentees($id);
        return response()->json($mentees);
    }

    public function schedules($id)
    {
        $schedules = $this->mentorService->getMentorSchedules($id);
        return response()->json($schedules);
    }

    public function giveTask(Request $request, $id)
    {
        $request->validate([
            'pairing_id' => 'required|exists:pairings,id',
            'mentee_id'  => 'required|exists:users,id',
            'judul'      => 'required|string',
            'deskripsi'  => 'nullable|string',
        ]);

        $task = $this->mentorService->giveTask($id, $request->all());

        return response()->json([
            'message' => 'Tugas berhasil diberikan',
            'task'    => $task
        ], 201);
    }

    public function giveFeedback(Request $request, $reportId)
    {
        $request->validate([
            'feedback' => 'required|string',
        ]);

        $report = $this->mentorService->giveFeedback($reportId, $request->feedback);

        return response()->json([
            'message' => 'Feedback berhasil ditambahkan',
            'report'  => $report
        ]);
    }

    public function uploadMaterial(Request $request, $id)
    {
        $request->validate([
            'file_path' => 'required|string',
        ]);

        $material = $this->mentorService->uploadMaterial($id, $request->all());

        return response()->json([
            'message'  => 'Materi berhasil diupload',
            'material' => $material
        ], 201);
    }
}
