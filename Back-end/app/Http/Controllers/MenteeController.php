<?php

namespace App\Http\Controllers;

use App\Services\MenteeService;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

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
     * Report mentee
     */
    public function reports($id)
    {
        return response()->json(
            $this->menteeService->getMenteeReports($id),
            200
        );
    }

    /**
     * Task mentee
     */
    public function tasks($id)
    {
        return response()->json(
            $this->menteeService->getMenteeTasks($id),
            200
        );
    }

    /**
     * Upload task
     */
    public function uploadTask(Request $request, $id)
    {
        /**
         * 🔐 Pastikan mentee hanya upload task miliknya sendiri
         */
        if (auth()->id() !== (int) $id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $task = $this->menteeService->uploadTask($request, $id);

            return response()->json([
                'message' => 'Tugas berhasil diupload',
                'data'    => $task
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors'  => $e->errors()
            ], 422);
        }
    }

    public function schedules($id)
    {
        // 🔐 mentee hanya boleh lihat jadwalnya sendiri
        if (auth()->id() !== (int) $id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(
            $this->menteeService->getMenteeSchedules($id),
            200
        );
    }
}
