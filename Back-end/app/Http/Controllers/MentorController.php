<?php

namespace App\Http\Controllers;

use App\Services\MentorService;
use Illuminate\Http\Request;

class MentorController extends Controller
{
    protected $mentorService;

    public function __construct(MentorService $mentorService)
    {
        $this->mentorService = $mentorService;
    }

    /**
     * Ambil semua mentor
     */
    public function index()
    {
        $mentors = $this->mentorService->getAllMentors();
        return response()->json($mentors);
    }

    /**
     * Detail mentor
     */
    public function show($id)
    {
        $mentor = $this->mentorService->getMentorById($id);
        return response()->json($mentor);
    }

    /**
     * Ambil semua mentee yang dimiliki mentor
     */
    public function mentees($id)
    {
        $mentees = $this->mentorService->getMentorMentees($id);
        return response()->json($mentees);
    }

    /**
     * Ambil jadwal mentor
     */
    public function schedules($id)
    {
        $schedules = $this->mentorService->getMentorSchedules($id);
        return response()->json($schedules);
    }

    /**
     * Beri tugas ke mentee
     */
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

    /**
     * Beri feedback ke report mentee
     */
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

    /**
     * Upload materi (misalnya video atau dokumen)
     */
    public function uploadMaterial(Request $request, $id)
    {
        $request->validate([
            'file_path' => 'required|string', // nanti bisa ganti jadi file upload
        ]);

        $material = $this->mentorService->uploadMaterial($id, $request->all());

        return response()->json([
            'message'  => 'Materi berhasil diupload',
            'material' => $material
        ], 201);
    }
}
