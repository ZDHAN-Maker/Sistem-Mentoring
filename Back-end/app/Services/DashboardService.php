<?php

namespace App\Services;

use App\Models\User;
use App\Models\Pairing;
use App\Models\Schedule;
use App\Models\Material;
use App\Models\Task;
use App\Models\Submission;
use App\Models\ProgressReport;
use App\Models\LearningActivity;
use App\Models\Notification;
use Carbon\Carbon;

class DashboardService
{
    /**
     * Mengambil statistik lengkap untuk Dashboard Admin
     */
    public function getAdminDashboardStats(): array
    {
        return [
            'total_user'                    => User::count(),
            'total_mentor'                  => User::whereHas('roles', fn($q) => $q->where('name', 'Mentor'))->count(),
            'total_mentee'                  => User::whereHas('roles', fn($q) => $q->where('name', 'Mentee'))->count(),
            'total_admin'                   => User::whereHas('roles', fn($q) => $q->where('name', 'Admin'))->count(),
            'total_pairing_aktif'           => Pairing::where('status', 'active')->count(),
            'total_pairing_selesai'         => Pairing::where('status', 'completed')->count(),
            'total_langganan_aktif'         => Pairing::where('status', 'active')->where(fn($q) => $q->whereNull('ended_at')->orWhere('ended_at', '>=', now()))->count(),
            'total_langganan_segera_habis'  => Pairing::where('status', 'active')->whereNotNull('ended_at')->whereBetween('ended_at', [now(), now()->addDays(14)])->count(),
            'mentees_tanpa_pairing'         => User::whereHas('roles', fn($q) => $q->where('name', 'Mentee'))->whereDoesntHave('menteePairings', fn($q) => $q->where('status', 'active'))->count(),
            'sertifikat_diterbitkan'        => Pairing::where('certificate_eligible', true)->count(),
            'total_learning_activity'       => LearningActivity::count(),
            'total_jadwal'                  => Schedule::count(),
            'jadwal_mendatang'              => Schedule::where('start_time', '>=', now())->count(),
            'total_materi'                  => Material::count(),
            'total_tugas'                   => Task::count(),
            'total_submission'              => Submission::count(),
            'total_progress_report'         => ProgressReport::count(),
            'total_notifikasi'              => Notification::count(),
            'total_paket_langganan'         => \App\Models\SubscriptionPlan::count(),
        ];
    }

    /**
     * Mengambil statistik khusus untuk Mentor (Hanya data miliknya)
     */
    public function getMentorDashboardStats(User $mentor): array
    {
        // Hubungan pairing aktif milik mentor
        $mentorPairingIds = Pairing::where('mentor_id', $mentor->id)->pluck('id');

        return [
            'total_mentee'               => Pairing::where('mentor_id', $mentor->id)->distinct('mentee_id')->count('mentee_id'),
            'pairing_aktif'              => Pairing::where('mentor_id', $mentor->id)->count(),
            'jadwal_hari_ini'            => Schedule::whereIn('pairing_id', $mentorPairingIds)
                ->whereDate('start_time', Carbon::today())
                ->count(),
            'total_materi'               => Material::where('mentor_id', $mentor->id)->count(),
            'materi_dipublish'           => Material::where('mentor_id', $mentor->id)->where('status', 'published')->count(),
            'total_tugas'                => Task::where('mentor_id', $mentor->id)->count(),
            'submission_menunggu_review' => Submission::whereIn('task_id', function ($q) use ($mentor) {
                $q->select('id')->from('tasks')->where('mentor_id', $mentor->id);
            })->where('status', 'submitted')->count(),
            'submission_sudah_dinilai'   => Submission::whereIn('task_id', function ($q) use ($mentor) {
                $q->select('id')->from('tasks')->where('mentor_id', $mentor->id);
            })->whereIn('status', ['reviewed', 'completed'])->count(),
            'progress_report_dibuat'     => ProgressReport::where('mentor_id', $mentor->id)->count(),
            'notifikasi_baru'            => Notification::where('user_id', $mentor->id)->where('is_read', false)->count(),
        ];
    }

    /**
     * Mengambil statistik khusus untuk Mentee (Hanya data miliknya)
     */
    public function getMenteeDashboardStats(User $mentee): array
    {
        // Mengambil info pairing mentee
        $activePairings = Pairing::where('mentee_id', $mentee->id)->with('mentor')->get();
        $pairingIds     = $activePairings->pluck('id');

        // Mengambil nama mentor (jika ada lebih dari 1 mentor, digabung dengan koma)
        $mentorNames = $activePairings->map(fn($p) => $p->mentor->name)->implode(', ') ?: 'Belum Ada Mentor';

        // Menghitung progress belajar (%)
        // Rumus: (Materi yang sudah selesai / Total materi tersedia di bidang keahlian pairing-nya) * 100
        $totalMaterialsAvailable = Material::count(); // Sederhananya total materi, bisa disesuaikan dengan kurikulum pairing
        $completedMaterialsCount = \DB::table('material_progress')
            ->where('mentee_id', $mentee->id)
            ->where('is_completed', true)
            ->count();

        $progressBelajarPersen = $totalMaterialsAvailable > 0
            ? round(($completedMaterialsCount / $totalMaterialsAvailable) * 100, 2)
            : 0;

        // Jadwal terdekat berikutnya
        $nextSchedule = Schedule::whereIn('pairing_id', $pairingIds)
            ->where('start_time', '>=', Carbon::now())
            ->orderBy('start_time', 'asc')
            ->first();

        // Nilai submission terakhir
        $lastGradedSubmission = Submission::where('mentee_id', $mentee->id)
            ->whereNotNull('grade')
            ->latest('reviewed_at')
            ->first();

        return [
            'mentor_saya'            => $mentorNames,
            'jadwal_berikutnya'      => $nextSchedule ? $nextSchedule->start_time->format('Y-m-d H:i') : 'Tidak Ada Jadwal Terdekat',
            'total_materi'           => $totalMaterialsAvailable,
            'materi_selesai'         => $completedMaterialsCount,
            'progress_belajar_persen' => $progressBelajarPersen,
            'tugas_aktif'            => Task::whereIn('pairing_id', $pairingIds)->where('status', 'published')->count(),
            'submission_saya'        => Submission::where('mentee_id', $mentee->id)->count(),
            'nilai_terakhir'         => $lastGradedSubmission ? (float) $lastGradedSubmission->grade : 0,
            'progress_report'        => ProgressReport::whereIn('pairing_id', $pairingIds)->count(),
            'notifikasi_baru'        => Notification::where('user_id', $mentee->id)->where('is_read', false)->count(),
        ];
    }
}
