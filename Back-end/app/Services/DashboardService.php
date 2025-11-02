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

        if (!$mentor) {
            throw new \Exception("Mentor not found");
        }

        return [
            'total_mentees'   => $mentor->mentorPairings()->count(),
            'total_schedules' => $mentor->schedules()->count(),
            'total_reports'   => $mentor->progressReports()->count(),
            'pending_tasks'   => $mentor->tasks()->where('status', 'pending')->count(),
        ];
    }

    public function getMenteeStats($menteeId)
    {
        $mentee = User::find($menteeId);

        if (!$mentee) {
            throw new \Exception("Mentee not found");
        }

        return [
            'my_schedules'    => $mentee->schedules()->count(),
            'my_reports'      => $mentee->progressReports()->count(),
            'my_tasks'        => $mentee->tasks()->count(),
            'completed_tasks' => $mentee->tasks()->where('status', 'completed')->count(),
        ];
    }
}
