<?php

namespace App\Services;

use App\Models\LearningPath;

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

    public function assignMentor(LearningPath $path, $mentorId)
    {
        if ($path->mentors()->where('user_id', $mentorId)->exists()) {
            return ['message' => 'Mentor already assigned'];
        }

        $path->mentors()->attach($mentorId);
        return $path->mentors;
    }

    public function removeMentor(LearningPath $path, $mentorId)
    {
        if (!$path->mentors()->where('user_id', $mentorId)->exists()) {
            return ['message' => 'Mentor not found in this path'];
        }

        $path->mentors()->detach($mentorId);
        return $path->mentors;
    }

    public function replaceMentor(LearningPath $path, $oldId, $newId)
    {
        if (!$path->mentors()->where('user_id', $oldId)->exists()) {
            return ['message' => 'Old mentor is not part of this path'];
        }

        $path->mentors()->detach($oldId);

        if (!$path->mentors()->where('user_id', $newId)->exists()) {
            $path->mentors()->attach($newId);
        }

        return $path->mentors;
    }

    public function assignMentee(LearningPath $path, $menteeId)
    {
        if ($path->mentees()->where('user_id', $menteeId)->exists()) {
            return ['message' => 'Mentee already assigned'];
        }

        $path->mentees()->attach($menteeId);
        return $path->mentees;
    }
}
