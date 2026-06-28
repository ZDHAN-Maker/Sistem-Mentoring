<?php

namespace App\Services;

use App\Models\LearningActivity;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class LearningActivityService
{
    /**
     * Membuat bidang keahlian baru (Master Data).
     */
    public function createActivity(array $data): LearningActivity
    {
        return LearningActivity::create($data);
    }

    /**
     * Mengubah bidang keahlian yang sudah ada.
     */
    public function updateActivity(LearningActivity $activity, array $data): LearningActivity
    {
        $activity->update($data);
        return $activity;
    }

    /**
     * Menghapus bidang keahlian.
     */
    public function deleteActivity(LearningActivity $activity): void
    {
        // Secara otomatis akan menghapus relasi di tabel pivot jika onDelele('cascade') 
        // di-set pada migration. Jika tidak, bersihkan pivot secara manual:
        $activity->mentors()->detach();
        $activity->delete();
    }

    /**
     * Menetapkan (Sync) bidang keahlian ke Mentor.
     * Menggunakan method sync() agar data lama yang tidak dipilih akan terhapus otomatis,
     * dan data baru akan ditambahkan tanpa terjadi duplikasi.
     */
    public function syncMentorActivities(User $mentor, array $activityIds): array
    {
        // 1. Validasi bahwa user yang di-passing benar-benar memiliki role 'Mentor'
        if (!$mentor->hasRole('Mentor')) {
            throw new Exception("User yang dipilih bukan seorang Mentor.");
        }

        // 2. Lakukan proses sync pada tabel pivot (mentor_learning_activity)
        $changes = $mentor->learningActivities()->sync($activityIds);

        return $changes;
    }
}