<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * GET /reports
     */
    public function index()
    {
        $reports = $this->reportService->getAllReports();
        return response()->json($reports);
    }

    /**
     * GET /reports/mentee/{id}
     */
    public function getByMentee($id)
    {
        $reports = $this->reportService->getReportsByMentee($id);
        return response()->json($reports);
    }

    /**
     * GET /reports/mentor/{id}
     */
    public function getByMentor($id)
    {
        $reports = $this->reportService->getReportsByMentor($id);
        return response()->json($reports);
    }

    /**
     * POST /reports
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pairing_id' => 'required|exists:pairings,id',
            'mentor_id'  => 'required|exists:users,id',
            'mentee_id'  => 'required|exists:users,id',
            'judul'      => 'required|string|max:255',
            'isi'        => 'required|string',
        ]);

        $report = $this->reportService->createReport($validated);
        return response()->json(['message' => 'Report created successfully', 'report' => $report]);
    }

    /**
     * PUT /reports/{id}
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'judul' => 'nullable|string|max:255',
            'isi'   => 'nullable|string',
            'status' => 'nullable|in:submitted,reviewed,approved,rejected',
        ]);

        $report = $this->reportService->updateReport($id, $validated);
        return response()->json(['message' => 'Report updated successfully', 'report' => $report]);
    }

    /**
     * DELETE /reports/{id}
     */
    public function destroy($id)
    {
        $this->reportService->deleteReport($id);
        return response()->json(['message' => 'Report deleted successfully']);
    }
}
