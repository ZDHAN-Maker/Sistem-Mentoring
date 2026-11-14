<?php

namespace App\Services;

use App\Models\ProgressReport;
use App\Models\Pairing;
use App\Models\User;
use App\Events\ProgressReportCreated;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProgressReportService
{
    /**
     * Mengambil daftar laporan berdasarkan peran user (Mentor / Mentee / Admin)
     */
    public function getReportsByUser(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = ProgressReport::with(['pairing.mentee', 'pairing.mentor', 'mentor']);

        // Jika dia Mentor, hanya tampilkan laporan yang dia buat
        if ($user->hasRole('Mentor')) {
            $query->where('mentor_id', $user->id);
        }
        // Jika dia Mentee, hanya tampilkan laporan perkembangan dirinya sendiri
        elseif ($user->hasRole('Mentee')) {
            $query->whereHas('pairing', function ($q) use ($user) {
                $q->where('mentee_id', $user->id);
            });
        }
        // Admin bisa melihat semua data (no filtering)

        // Filter tambahan berdasarkan pairing_id jika dikirim dari frontend
        if (!empty($filters['pairing_id'])) {
            $query->where('pairing_id', $filters['pairing_id']);
        }

        return $query->latest('report_date')->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Mentor membuat laporan penilaian / evaluasi perkembangan mentee
     */
    /**
     * Mentor membuat laporan penilaian / evaluasi perkembangan mentee (bisa satu atau banyak mentee sekaligus)
     */
    public function createReports(array $data, User $mentor): array
    {
        $pairingIds = [];
        if (!empty($data['pairing_ids']) && is_array($data['pairing_ids'])) {
            $pairingIds = array_values(array_filter($data['pairing_ids']));
        } elseif (!empty($data['pairing_id'])) {
            $pairingIds = [$data['pairing_id']];
        }

        if (empty($pairingIds)) {
            throw new AuthorizationException('Pilih minimal satu mentee bimbingan untuk diberikan penilaian/evaluasi.');
        }

        $validPairings = Pairing::whereIn('id', $pairingIds)
            ->where('mentor_id', $mentor->id)
            ->with('mentee')
            ->get();

        if ($validPairings->isEmpty()) {
            throw new AuthorizationException('Anda tidak memiliki hak akses untuk memberikan penilaian pada sesi pairing ini.');
        }

        $createdReports = [];
        foreach ($validPairings as $pairing) {
            $report = ProgressReport::create([
                'pairing_id'  => $pairing->id,
                'mentor_id'   => $mentor->id,
                'report_date' => $data['report_date'] ?? now()->toDateString(),
                'note'        => $data['note'] ?? ($data['summary'] ?? '')
            ]);

            $report->load(['pairing.mentee']);
            event(new ProgressReportCreated($report));

            $createdReports[] = $report;
        }

        return $createdReports;
    }

    /**
     * Mentor membuat laporan penilaian tunggal (backward compatibility)
     */
    public function createReport(array $data, User $mentor): ProgressReport
    {
        $reports = $this->createReports($data, $mentor);
        return $reports[0];
    }

    /**
     * Mengambil detail laporan penilaian (Dapat diakses oleh Mentor pemilik atau Mentee bersangkutan)
     */
    public function getReportById(int $id, User $user): ProgressReport
    {
        $report = ProgressReport::with(['pairing.mentee', 'pairing.mentor'])->find($id);

        if (!$report) {
            throw new NotFoundHttpException('Laporan penilaian tidak ditemukan.');
        }

        // Validasi batasan data: Mentor pembimbing atau Mentee yang dinilai yang boleh melihat
        if ($user->hasRole('Mentor') && $report->mentor_id !== $user->id) {
            throw new AuthorizationException('Anda tidak diizinkan melihat laporan ini.');
        }

        if ($user->hasRole('Mentee') && $report->pairing->mentee_id !== $user->id) {
            throw new AuthorizationException('Ini bukan laporan penilaian Anda.');
        }

        return $report;
    }

    /**
     * Mengubah laporan oleh Mentor
     */
    public function updateReport(int $id, array $data, User $mentor): ProgressReport
    {
        $report = ProgressReport::find($id);

        if (!$report) {
            throw new NotFoundHttpException('Laporan tidak ditemukan.');
        }

        // Pastikan hanya mentor pembuat laporan yang bisa mengubah
        if ($report->mentor_id !== $mentor->id) {
            throw new AuthorizationException('Anda tidak memiliki hak akses untuk mengubah laporan ini.');
        }

        $report->update($data);

        return $report->load(['pairing.mentee', 'mentor']);
    }

    /**
     * Menghapus laporan perkembangan
     */
    public function deleteReport(int $id, User $mentor): void
    {
        $report = ProgressReport::find($id);

        if (!$report) {
            throw new NotFoundHttpException('Laporan tidak ditemukan.');
        }

        if ($report->mentor_id !== $mentor->id) {
            throw new AuthorizationException('Anda tidak memiliki hak akses untuk menghapus laporan ini.');
        }

        $report->delete();
    }
}
