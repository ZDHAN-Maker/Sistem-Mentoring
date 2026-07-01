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
    public function createReport(array $data, User $mentor): ProgressReport
    {
        // 1. Keamanan RESTful: Pastikan ID Pairing yang dikirim adalah milik Mentor yang sedang login
        $pairing = Pairing::where('id', $data['pairing_id'])
            ->where('mentor_id', $mentor->id)
            ->first();

        if (!$pairing) {
            throw new AuthorizationException('Anda tidak memiliki hak akses untuk memberikan penilaian pada sesi pairing ini.');
        }

        // 2. Simpan data evaluasi perkembangan ke database
        $report = ProgressReport::create([
            'pairing_id'  => $data['pairing_id'],
            'mentor_id'   => $mentor->id,
            'title'       => $data['title'],       // Misal: "Evaluasi Bulan Juni"
            'summary'     => $data['summary'],     // Catatan rangkuman mentor
            'performance_grade' => $data['performance_grade'], // Nilai performa (misal skala 1-100 atau A-E)
            'status'      => 'published'
        ]);

        // 3. Eager load relasi pairing dan mentee untuk kebutuhan data di Listener
        $report->load(['pairing.mentee']);

        // 4. PICU EVENT: Sistem mengurus notifikasi di background proses secara otomatis
        event(new ProgressReportCreated($report));

        return $report;
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
