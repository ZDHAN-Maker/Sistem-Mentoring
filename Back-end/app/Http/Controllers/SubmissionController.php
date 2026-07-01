<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubmissionRequest;
use App\Http\Requests\ReviewSubmissionRequest;
use App\Services\SubmissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Exception;

class SubmissionController extends Controller
{
    protected $submissionService;

    public function __construct(SubmissionService $submissionService)
    {
        $this->submissionService = $submissionService;
    }

    /**
     * GET /api/submissions
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['status', 'task_id', 'per_page']);
            $submissions = $this->submissionService->getSubmissionsByUser($request->user(), $filters);

            return response()->json([
                'status'  => 'success',
                'message' => 'Daftar submission berhasil diambil.',
                'data'    => $submissions->items(),
                'meta'    => [
                    'current_page' => $submissions->currentPage(),
                    'last_page'    => $submissions->lastPage(),
                    'per_page'     => $submissions->perPage(),
                    'total'        => $submissions->total(),
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Terjadi kesalahan sistem.'], 500);
        }
    }

    /**
     * GET /api/submissions/{id}
     */
    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $submission = $this->submissionService->getSubmissionById($id, $request->user());

            return response()->json([
                'status' => 'success',
                'data'   => $submission
            ], 200);
        } catch (NotFoundHttpException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 404);
        } catch (AuthorizationException $e) {
            return response()->json(['status' => 'forbidden', 'message' => $e->getMessage()], 403);
        }
    }

    /**
     * POST /api/submissions (AKTOR: MENTEE)
     * Mengumpulkan tugas
     */
    public function store(StoreSubmissionRequest $request): JsonResponse
    {
        try {
            $file = $request->file('file');
            $submission = $this->submissionService->createSubmission(
                $request->validated(), 
                $file, 
                $request->user()
            );

            return response()->json([
                'status'  => 'success',
                'message' => 'Tugas berhasil dikumpulkan.',
                'data'    => $submission
            ], 201);

        } catch (AuthorizationException $e) {
            return response()->json(['status' => 'forbidden', 'message' => $e->getMessage()], 403);
        } catch (NotFoundHttpException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 404);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    /**
     * PUT/PATCH /api/submissions/{id}/review (AKTOR: MENTOR)
     * Memberikan Nilai & Feedback
     */
    public function review(ReviewSubmissionRequest $request, int $id): JsonResponse
    {
        try {
            $submission = $this->submissionService->reviewSubmission(
                $id, 
                $request->validated(), 
                $request->user()
            );

            return response()->json([
                'status'  => 'success',
                'message' => 'Penilaian submission berhasil disimpan.',
                'data'    => $submission
            ], 200);

        } catch (AuthorizationException $e) {
            return response()->json(['status' => 'forbidden', 'message' => $e->getMessage()], 403);
        } catch (NotFoundHttpException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 404);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal memproses penilaian.'], 400);
        }
    }
}