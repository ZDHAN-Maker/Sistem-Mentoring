<?php

namespace App\Services;

use App\Models\Material;
use App\Models\User;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\ProgressReport;
use App\Models\Pairing;

class MentorService
{
    /**
     * Ambil semua mentor
     */
    public function getAllMentors()
    {
        return User::whereHas('roles', fn($q) => $q->where('name', 'Mentor'))
            ->with(['roles', 'learningActivities'])
            ->withCount(['mentorPairings as active_pairings_count' => function ($q) {
                $q->where('status', 'active');
            }])
            ->get();
    }

    /**
     * Ambil detail mentor tertentu
     */
    public function getMentorById($id)
    {
        return User::whereHas('roles', fn($q) => $q->where('name', 'Mentor'))
            ->with(['roles', 'learningActivities'])
            ->findOrFail($id);
    }

    /**
     * Ambil semua mentee yang dimiliki mentor (via tabel Pairing) beserta statistik aktivitas
     */
    public function getMentorMentees($mentorId)
    {
        // pastikan mentor ada
        $mentor = $this->getMentorById($mentorId);

        // ambil semua pairing milik mentor beserta relasi lengkap
        $pairings = $mentor->mentorPairings()
            ->with([
                'mentee:id,name,email,phone,avatar,bio',
                'mentee.learningActivities:id,title',
                'subscriptionPlan',
                'schedules',
                'tasks.submissions',
                'progressReports' => fn($q) => $q->latest()
            ])
            ->latest()
            ->get();

        $now = now();

        return $pairings->map(function (Pairing $pairing) use ($now) {
            $endedAt = $pairing->ended_at ? \Carbon\Carbon::parse($pairing->ended_at) : null;
            $remainingDays = 0;
            if ($endedAt) {
                $diff = ceil($now->diffInDays($endedAt, false));
                $remainingDays = $diff > 0 ? (int)$diff : 0;
            }

            $totalTasks = $pairing->tasks ? $pairing->tasks->count() : 0;
            $completedTasks = $pairing->tasks ? $pairing->tasks->filter(function ($task) {
                return $task->submissions && $task->submissions->contains(fn($sub) => in_array($sub->status, ['completed', 'reviewed']));
            })->count() : 0;

            $totalSchedules = $pairing->schedules ? $pairing->schedules->count() : 0;
            $completedSchedules = $pairing->schedules ? $pairing->schedules->where('status', 'completed')->count() : 0;
            $upcomingSchedules = $pairing->schedules ? $pairing->schedules->filter(function ($s) {
                return in_array($s->status, ['planned', 'scheduled', 'ongoing']);
            })->count() : 0;

            $latestReport = $pairing->progressReports ? $pairing->progressReports->first() : null;

            return [
                'pairing_id'            => $pairing->id,
                'status'                => $pairing->status,
                'completion_status'     => $pairing->completion_status,
                'certificate_eligible'  => (bool)$pairing->certificate_eligible,
                'started_at'            => $pairing->started_at ? $pairing->started_at->format('Y-m-d') : null,
                'ended_at'              => $pairing->ended_at ? $pairing->ended_at->format('Y-m-d') : null,
                'duration_months'       => $pairing->duration_months,
                'remaining_days'        => $remainingDays,
                'subscription_name'     => $pairing->subscription_name ?: optional($pairing->subscriptionPlan)->name ?: 'Paket Reguler',
                'subscription_plan'     => $pairing->subscriptionPlan,
                'mentee'                => [
                    'id'                 => optional($pairing->mentee)->id,
                    'name'               => optional($pairing->mentee)->name,
                    'email'              => optional($pairing->mentee)->email,
                    'phone'              => optional($pairing->mentee)->phone,
                    'avatar'             => optional($pairing->mentee)->avatar,
                    'bio'                => optional($pairing->mentee)->bio,
                    'learning_activities'=> optional($pairing->mentee)->learningActivities ?: [],
                ],
                'stats'                 => [
                    'total_tasks'         => $totalTasks,
                    'completed_tasks'     => $completedTasks,
                    'task_progress_pct'   => $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0,
                    'total_schedules'     => $totalSchedules,
                    'completed_schedules' => $completedSchedules,
                    'upcoming_schedules'  => $upcomingSchedules,
                    'total_reports'       => $pairing->progressReports ? $pairing->progressReports->count() : 0,
                    'latest_report_date'  => $latestReport ? $latestReport->report_date : null,
                    'latest_report_note'  => $latestReport ? $latestReport->note : null,
                ],
            ];
        });
    }

    /**
     * Ambil semua jadwal mentor
     */
    public function getMentorSchedules($mentorId)
    {
        return Schedule::where('mentor_id', $mentorId)->get();
    }

    /**
     * Mentor memberikan tugas ke mentee
     */
    public function giveTask($mentorId, array $data)
    {
        return Task::create([
            'pairing_id' => $data['pairing_id'],
            'mentor_id'  => $mentorId,
            'mentee_id'  => $data['mentee_id'],
            'judul'      => $data['judul'],
            'deskripsi'  => $data['deskripsi'] ?? null,
            'status'     => 'pending',
        ]);
    }

    /**
     * Mentor memberi feedback pada report
     */
    public function giveFeedback($reportId, $feedback)
    {
        $report = ProgressReport::findOrFail($reportId);
        $report->feedback = $feedback;
        $report->save();

        return $report;
    }

    /**
     * Mentor mengupload materi (misalnya video, file, dll)
     */
    public function uploadMaterial($mentorId, array $data, $file = null)
{
    $filePath = null;
    if ($file) {
        $filePath = $file->store('materials', 's3');
    }

    return Material::create([
        'mentor_id'  => $mentorId,
        'judul'      => $data['judul'] ?? null,
        'type'       => $data['type'] ?? 'pdf',
        'file_path'  => $filePath,
        'external_url' => $data['external_url'] ?? null,
    ]);
}
}
