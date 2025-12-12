<?php

namespace App\Services;

use App\Models\LearningPath;
use Illuminate\Support\Facades\DB;

class LearningPathService
{
    public function getAllPaths()
    {
        return LearningPath::with(['mentors', 'mentees', 'activities'])->get();
    }

    public function createPath(array $data)
    {
        return LearningPath::create($data);
    }

    public function updatePath(LearningPath $path, array $data)
    {
        $path->update($data);
        return $path;
    }

    public function deletePath(LearningPath $path)
    {
        return $path->delete();
    }

    public function assignMentor(LearningPath $path, $mentorId)
    {
        $path->mentors()->syncWithoutDetaching([$mentorId]);
    }

    public function assignMentee(LearningPath $path, $menteeId)
    {
        $path->mentees()->syncWithoutDetaching([$menteeId]);
    }
}
