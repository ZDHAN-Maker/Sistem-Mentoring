<?php

namespace App\Http\Controllers;

use App\Services\MenteeService;
use Illuminate\Http\Request;

class MenteeController extends Controller
{
    protected $menteeService;

    public function __construct(MenteeService $menteeService)
    {
        $this->menteeService = $menteeService;
    }

    /**
     * Ambil semua mentee
     */
    public function index()
    {
        $mentees = $this->menteeService->getAllMentees();
        return response()->json($mentees);
    }

    /**
     * Ambil detail mentee tertentu
     */
    public function show($id)
    {
        $mentee = $this->menteeService->getMenteeById($id);
        return response()->json($mentee);
    }

    /**
     * Ambil semua laporan progress mentee
     */
    public function reports($id)
    {
        $reports = $this->menteeService->getMenteeReports($id);
        return response()->json($reports);
    }

    /**
     * Ambil semua tugas mentee
     */
    public function tasks($id)
    {
        $tasks = $this->menteeService->getMenteeTasks($id);
        return response()->json($tasks);
    }

    /**
     * Upload tugas baru oleh mentee
     */
    public function uploadTask(Request $request, $id)
    {
        $request->validate([
            'pairing_id' => 'required|exists:pairings,id',
            'judul'      => 'required|string',
            'deskripsi'  => 'nullable|string',
            'file_path'  => 'nullable|string',
        ]);

        $task = $this->menteeService->uploadTask($id, $request->all());

        return response()->json([
            'message' => 'Tugas berhasil diupload',
            'task'    => $task
        ], 201);
    }
}
