<?php

namespace App\Services;

use App\Models\Schedule;

class ScheduleService
{
    public function getAll()
    {
        return Schedule::with('pairing')->latest()->get();
    }

    public function getById($id)
    {
        return Schedule::with('pairing')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Schedule::create($data);
    }

    public function update($id, array $data)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->update($data);

        return $schedule;
    }

    public function delete($id)
    {
        $schedule = Schedule::findOrFail($id);
        return $schedule->delete();
    }
    
    public function getAllForUser($user)
    {
        if ($user->role === 'admin') {
            return Schedule::with('pairing')->latest()->get();
        }

        if ($user->role === 'mentor') {
            return Schedule::whereHas('pairing', function ($q) use ($user) {
                $q->where('mentor_id', $user->id);
            })->with('pairing')->latest()->get();
        }

        if ($user->role === 'mentee') {
            return Schedule::whereHas('pairing', function ($q) use ($user) {
                $q->where('mentee_id', $user->id);
            })->with('pairing')->latest()->get();
        }

        return [];
    }
}
