<?php

namespace App\Services;

use App\Models\LearningActivity;

class LearningActivityService
{
    /**
     * Membuat Learning Activity baru.
     */
    public function createLearningActivity(array $data)
    {
        return LearningActivity::create($data);
    }

    /**
     * Mengambil semua materi yang terkait dengan Learning Activity tertentu.
     */
    public function getMaterialsByLearningActivity($learningActivityId)
    {
        $learningActivity = LearningActivity::find($learningActivityId);

        if (!$learningActivity) {
            return null;
        }

        return $learningActivity->materials;
    }

    /**
     * Menugaskan mentor ke Learning Activity (menghindari duplikasi assignment).
     */
    public function assignMentorToActivity($learningActivityId, $mentorId)
    {
        $activity = LearningActivity::find($learningActivityId);

        if (!$activity) return false;

        // Cek apakah mentor sudah ter-assign
        if ($activity->mentors()->where('mentor_id', $mentorId)->exists()) {
            return true;
        }

        $activity->mentors()->attach($mentorId);
        return true;
    }

    /**
     * Mengambil daftar Learning Activity yang relevan untuk seorang mentee,
     * berdasarkan mentor yang sedang aktif melakukan pairing dengan mentee.
     */
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
