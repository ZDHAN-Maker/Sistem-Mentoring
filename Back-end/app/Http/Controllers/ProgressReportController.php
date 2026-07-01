<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProgressReportRequest;
use App\Http\Requests\UpdateProgressReportRequest;
use App\Services\ProgressReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Exception;

class ProgressReportController extends Controller
{
    protected $reportService;

    public function __construct(ProgressReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['pairing_id', 'per_page']);
            $reports = $this->reportService->getReportsByUser($request->user(), $filters);

            return response()->json([
                'status'  => 'success',
                'message' => 'Daftar laporan perkembangan berhasil diambil.',
                'data'    => $reports->items(),
                'meta'    => [
                    'current_page' => $reports->currentPage(),
                    'last_page'    => $reports->lastPage(),
                    'per_page'     => $reports->perPage(),
                    'total'        => $reports->total(),
                ]
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Terjadi kesalahan internal sistem.'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProgressReportRequest $request): JsonResponse
    {
        try {
            $report = $this->reportService->createReport($request->validated(), $request->user());

            return response()->json([
                'status'  => 'success',
                'message' => 'Laporan perkembangan berhasil disimpan.',
                'data'    => $report
            ], 201);

        } catch (AuthorizationException $e) {
            return response()->json([
                'status'  => 'forbidden',
                'message' => $e->getMessage()
            ], 403);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menyimpan laporan.'
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $report = $this->reportService->getReportById($id, $request->user());

            return response()->json([
                'status'  => 'success',
                'data'    => $report
            ], 200);

        } catch (NotFoundHttpException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 404);
        } catch (AuthorizationException $e) {
            return response()->json([
                'status'  => 'forbidden',
                'message' => $e->getMessage()
            ], 403);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProgressReportRequest $request, int $id): JsonResponse
    {
        try {
            $report = $this->reportService->updateReport($id, $request->validated(), $request->user());

            return response()->json([
                'status'  => 'success',
                'message' => 'Laporan perkembangan berhasil diperbarui.',
                'data'    => $report
            ], 200);

        } catch (NotFoundHttpException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 404);
        } catch (AuthorizationException $e) {
            return response()->json([
                'status'  => 'forbidden',
                'message' => $e->getMessage()
            ], 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $this->reportService->deleteReport($id, $request->user());

            return response()->json([
                'status'  => 'success',
                'message' => 'Laporan perkembangan berhasil dihapus.'
            ], 200);

        } catch (NotFoundHttpException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 404);
        } catch (AuthorizationException $e) {
            return response()->json([
                'status'  => 'forbidden',
                'message' => $e->getMessage()
            ], 403);
        }
    }
}