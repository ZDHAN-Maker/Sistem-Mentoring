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
        return [
            'total_mentees'   => User::where('mentor_id', $mentorId)->count(),
            'total_schedules' => Schedule::where('mentor_id', $mentorId)->count(),
            'total_reports'   => ProgressReport::where('mentor_id', $mentorId)->count(),
            'pending_tasks'   => Task::where('mentor_id', $mentorId)->where('status', 'pending')->count(),
        ];
    }

    /**
     * Ambil statistik untuk dashboard Mentee
     */
    public function getMenteeStats($menteeId)
    {
        return [
            'my_schedules'    => Schedule::where('mentee_id', $menteeId)->count(),
            'my_reports'      => ProgressReport::where('mentee_id', $menteeId)->count(),
            'my_tasks'        => Task::where('mentee_id', $menteeId)->count(),
            'completed_tasks' => Task::where('mentee_id', $menteeId)->where('status', 'completed')->count(),
        ];
    }
}
