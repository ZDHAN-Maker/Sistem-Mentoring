<?php

namespace App\Services;

use App\Models\ProgressReport;

class ReportService
{
    /**
     * Ambil semua laporan progress
     */
    public function getAllReports()
    {
        return ProgressReport::with(['mentor', 'mentee'])->latest()->get();
    }

    /**
     * Ambil laporan berdasarkan mentee
     */
    public function getReportsByMentee($menteeId)
    {
        return ProgressReport::where('mentee_id', $menteeId)
            ->with('mentor')
            ->latest()
            ->get();
    }

    /**
     * Ambil laporan berdasarkan mentor
     */
    public function getReportsByMentor($mentorId)
    {
        return ProgressReport::where('mentor_id', $mentorId)
            ->with('mentee')
            ->latest()
            ->get();
    }

    /**
     * Buat laporan baru (oleh mentee)
     */
    public function createReport(array $data)
    {
        return ProgressReport::create([
            'pairing_id' => $data['pairing_id'],
            'mentor_id'  => $data['mentor_id'],
            'mentee_id'  => $data['mentee_id'],
            'judul'      => $data['judul'],
            'isi'        => $data['isi'],
            'status'     => 'submitted',
        ]);
    }

    /**
     * Update laporan (misalnya revisi dari mentee)
     */
    public function updateReport($id, array $data)
    {
        $report = ProgressReport::findOrFail($id);
        $report->update($data);

        return $report;
    }

    /**
     * Hapus laporan
     */
    public function deleteReport($id)
    {
        $report = ProgressReport::findOrFail($id);
        $report->delete();

        return true;
    }
}
