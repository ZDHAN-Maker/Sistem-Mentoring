<?php

namespace App\Services;

use App\Models\User;
use App\Models\LearningPath;
use Illuminate\Validation\ValidationException;

class LearningPathService
{
    public function getAllPaths()
    {
        return LearningPath::with(['mentors', 'mentees'])
            ->withCount(['mentors', 'mentees'])
            ->get();
    }

    public function getPathDetail($id)
    {
        return LearningPath::with(['mentors', 'mentees', 'activities'])
            ->withCount(['mentors', 'mentees'])
            ->findOrFail($id);
    }

    public function createPath(array $data)
    {
        return LearningPath::create($data);
    }

    public function updatePath(LearningPath $path, array $data)
    {
        $path->update($data);
        return $path->refresh();
    }

    public function deletePath(LearningPath $path)
    {
        return $path->delete();
    }

    /* ===================== MENTOR ===================== */

    public function assignMentor(LearningPath $path, int $mentorId)
    {
        $mentor = User::where('id', $mentorId)
            ->where('role', 'mentor')
            ->first();

        if (!$mentor) {
            throw ValidationException::withMessages([
                'mentor_id' => 'User is not a mentor'
            ]);
        }

        if ($path->mentors()->whereKey($mentorId)->exists()) {
            return ['message' => 'Mentor already assigned'];
        }

        $path->mentors()->attach($mentorId);

        return $path->load('mentors')->mentors;
    }

    public function removeMentor(LearningPath $path, int $mentorId)
    {
        if (!$path->mentors()->whereKey($mentorId)->exists()) {
            return ['message' => 'Mentor not found in this path'];
        }

        $path->mentors()->detach($mentorId);

        return $path->load('mentors')->mentors;
    }

    public function replaceMentor(LearningPath $path, int $oldId, int $newId)
    {
        if (!$path->mentors()->whereKey($oldId)->exists()) {
            throw ValidationException::withMessages([
                'old_mentor_id' => 'Old mentor not found in this path'
            ]);
        }

        $newMentor = User::where('id', $newId)
            ->where('role', 'mentor')
            ->first();

        if (!$newMentor) {
            throw ValidationException::withMessages([
                'new_mentor_id' => 'User is not a mentor'
            ]);
        }

        $path->mentors()->syncWithoutDetaching([$newId]);
        $path->mentors()->detach($oldId);

        return $path->load('mentors')->mentors;
    }

    /* ===================== MENTEE ===================== */

    public function assignMentee(LearningPath $path, int $menteeId)
    {
        $mentee = User::where('id', $menteeId)
            ->where('role', 'mentee')
            ->first();

        if (!$mentee) {
            throw ValidationException::withMessages([
                'mentee_id' => 'User is not a mentee'
            ]);
        }

        if ($path->mentees()->whereKey($menteeId)->exists()) {
            return ['message' => 'Mentee already assigned'];
        }

        $path->mentees()->attach($menteeId);

        return $path->load('mentees')->mentees;
    }

    public function getMyLearningPaths()
    {
        $user = Auth::user();

        if ($user->role !== 'mentee') {
            abort(403, 'Unauthorized');
        }

        return $user->learningPaths()
            ->with(['mentors'])
            ->withCount(['mentors', 'mentees'])
            ->get();
    }
}
