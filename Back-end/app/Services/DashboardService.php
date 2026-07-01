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
            'total_user'              => User::count(),
            'total_mentor'            => User::whereHas('roles', fn($q) => $q->where('name', 'Mentor'))->count(),
            'total_mentee'            => User::whereHas('roles', fn($q) => $q->where('name', 'Mentee'))->count(),
            'total_admin'             => User::whereHas('roles', fn($q) => $q->where('name', 'Admin'))->count(),
            'total_pairing_aktif'     => Pairing::where('status', 'active')->count(), // Asumsi ada field status
            'total_learning_activity' => LearningActivity::count(),
            'total_jadwal'            => Schedule::count(),
            'total_materi'            => Material::count(),
            'total_tugas'             => Task::count(),
            'total_submission'        => Submission::count(),
            'total_progress_report'   => ProgressReport::count(),
            'total_notifikasi'        => Notification::count(),
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
            'jadwal_hari_ini'            => Schedule::where('mentor_id', $mentor->id)
                ->whereDate('schedule_date', Carbon::today()) // Sesuaikan field date Anda
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
            ->where('schedule_date', '>=', Carbon::now())
            ->orderBy('schedule_date', 'asc')
            ->first();

        // Nilai submission terakhir
        $lastGradedSubmission = Submission::where('mentee_id', $mentee->id)
            ->whereNotNull('grade')
            ->latest('reviewed_at')
            ->first();

        return [
            'mentor_saya'            => $mentorNames,
            'jadwal_berikutnya'      => $nextSchedule ? $nextSchedule->schedule_date->format('Y-m-d H:i') : 'Tidak Ada Jadwal Terdekat',
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
