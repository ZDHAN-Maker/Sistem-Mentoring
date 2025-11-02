<?php

namespace App\Services;

use App\Models\User;
use App\Models\Schedule;
use App\Models\ProgressReport;
use App\Models\Task;

class DashboardService
{
    /**
     * Ambil statistik untuk dashboard Admin
     */
    public function getAdminStats()
    {
        return [
            'total_users'     => User::count(),
            'total_mentors'   => User::where('role', 'mentor')->count(),
            'total_mentees'   => User::where('role', 'mentee')->count(),
            'total_schedules' => Schedule::count(),
            'total_reports'   => ProgressReport::count(),
            'total_tasks'     => Task::count(),
        ];
    }

    /**
     * Ambil statistik untuk dashboard Mentor
     */
    public function getMentorStats($mentorId)
    {
        $mentor = User::find($mentorId);

        return [
            'total_mentees'   => $mentor->mentorPairings()->count(),  // Menggunakan relasi mentorPairings
            'total_schedules' => $mentor->schedules()->count(),        // Menggunakan relasi schedules
            'total_reports'   => $mentor->progressReports()->count(), // Menggunakan relasi progressReports
            'pending_tasks'   => $mentor->tasks()->where('status', 'pending')->count(),  // Menggunakan relasi tasks
        ];
    }

    /**
     * Ambil statistik untuk dashboard Mentee
     */
    public function getMenteeStats($menteeId)
    {
        $mentee = User::find($menteeId);

        return [
            'my_schedules'    => $mentee->schedules()->count(),    // Menggunakan relasi schedules
            'my_reports'      => $mentee->progressReports()->count(),  // Menggunakan relasi progressReports
            'my_tasks'        => $mentee->tasks()->count(),  // Menggunakan relasi tasks
            'completed_tasks' => $mentee->tasks()->where('status', 'completed')->count(),  // Menggunakan relasi tasks
        ];
    }
}
