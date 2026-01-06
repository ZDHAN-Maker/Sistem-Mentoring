<?php

namespace App\Services;

use App\Models\LearningActivity;
use App\Models\Material;

class LearningActivityService
{
    public function createLearningActivity(array $data)
    {
        return LearningActivity::create($data);
    }

    public function getMaterialsByLearningActivity($learningActivityId)
    {
        // Ambil semua materi yang terkait dengan learning activity
        $learningActivity = LearningActivity::find($learningActivityId);

        if (!$learningActivity) {
            return null;
        }

        return $learningActivity->materials;
    }

    public function assignMentorToActivity($learningActivityId, $mentorId)
    {
        $activity = LearningActivity::find($learningActivityId);

        if (!$activity) return false;

        if ($activity->mentors()->where('mentor_id', $mentorId)->exists()) {
            return true;
        }

        $activity->mentors()->attach($mentorId);

        return true;
    }

    public function getLearningActivitiesForMentee(int $menteeId)
    {
        return LearningActivity::whereHas('materials', function ($q) use ($menteeId) {
            $q->whereHas('mentor.pairings', function ($p) use ($menteeId) {
                $p->where('mentee_id', $menteeId)
                    ->where('status', 'active');
            });
        })->ordered()->get();
    }
}
