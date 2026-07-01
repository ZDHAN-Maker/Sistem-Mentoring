<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SyncExpertiseRequest;
use App\Services\MentorExpertiseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class MentorExpertiseController extends Controller
{
    protected $expertiseService;

    public function __construct(MentorExpertiseService $expertiseService)
    {
        $this->expertiseService = $expertiseService;
    }

    /**
     * GET /api/learning-activities
     * Mengambil master data semua keahlian yang ada di sistem (bisa diakses mentee/mentor untuk referensi)
     */
    public function index(): JsonResponse
    {
        try {
            $activities = $this->expertiseService->getAllLearningActivities();

            return response()->json([
                'status'  => 'success',
                'message' => 'Daftar aktivitas pembelajaran berhasil diambil.',
                'data'    => $activities
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal mengambil data aktivitas pembelajaran.'
            ], 500);
        }
    }

    /**
     * GET /api/mentor/expertises
     * Mengambil daftar keahlian milik mentor yang sedang login
     */
    public function myExpertises(Request $request): JsonResponse
    {
        try {
            $expertises = $this->expertiseService->getMentorExpertises($request->user());

            return response()->json([
                'status'  => 'success',
                'message' => 'Daftar keahlian Anda berhasil diambil.',
                'data'    => $expertises
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal mengambil data keahlian.'
            ], 500);
        }
    }

    /**
     * POST /api/mentor/expertises
     * Mengupdate / menyinkronkan daftar keahlian mentor
     */
    public function sync(SyncExpertiseRequest $request): JsonResponse
    {
        try {
            $result = $this->expertiseService->syncExpertises(
                $request->user(), 
                $request->input('learning_activity_ids')
            );

            return response()->json([
                'status'  => 'success',
                'message' => 'Bidang keahlian Anda berhasil diperbarui.',
                'data'    => [
                    'added_count'   => count($result['attached']),
                    'removed_count' => count($result['detached']),
                    'expertises'    => $result['current']
                ]
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memperbarui bidang keahlian.'
            ], 400);
        }
    }
}