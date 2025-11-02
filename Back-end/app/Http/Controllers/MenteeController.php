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
        try {
            $mentees = $this->menteeService->getAllMentees();
            return response()->json($mentees, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Ambil detail mentee
     */
    public function show($id)
    {
        try {
            $mentee = $this->menteeService->getMenteeById($id);
            return response()->json($mentee, 200);
        } catch (\Exception $e) {
            // Jika mentee tidak ditemukan, kembalikan status 404
            return response()->json(['message' => 'Mentee not found: ' . $e->getMessage()], 404);
        }
    }


    /**
     * Ambil semua laporan progress mentee
     */
    public function reports($id)
    {
        try {
            $reports = $this->menteeService->getMenteeReports($id);
            return response()->json($reports, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Ambil semua tugas mentee
     */
    public function tasks($id)
    {
        try {
            $tasks = $this->menteeService->getMenteeTasks($id);
            return response()->json($tasks, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Upload tugas baru oleh mentee
     */
    public function uploadTask(Request $request, $id)
    {
        try {
            // langsung panggil service
            $task = $this->menteeService->uploadTask($request, $id);

            return response()->json([
                'message' => 'Tugas berhasil diupload',
                'task'    => $task
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal upload tugas: ' . $e->getMessage()
            ], 400);
        }
    }
}
