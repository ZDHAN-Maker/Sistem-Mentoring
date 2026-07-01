<?php

namespace App\Services;

use App\Models\LearningActivity;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Exception;

class MentorExpertiseService
{
    /**
     * Mengambil semua daftar keahlian (master data) yang tersedia di sistem
     */
    public function getAllLearningActivities(): Collection
    {
        return LearningActivity::select('id', 'title', 'description')->get();
    }

    /**
     * Mengambil keahlian yang saat ini dimiliki oleh mentor yang sedang login
     */
    public function getMentorExpertises(User $mentor): Collection
    {
        return $mentor->learningActivities()->select('learning_activities.id', 'title', 'description')->get();
    }

    /**
     * Menyinkronkan (mengganti/memperbarui) bidang keahlian Mentor
     */
    public function syncExpertises(User $mentor, array $activityIds): array
    {
        return DB::transaction(function () use ($mentor, $activityIds) {
            // Menggunakan method sync() bawaan Eloquent Many-to-Many.
            // Method ini otomatis menghapus keahlian lama yang tidak dikirim,
            // dan menambahkan keahlian baru yang belum ada di pivot.
            $status = $mentor->learningActivities()->sync($activityIds);

            return [
                'attached' => $status['attached'], // ID yang baru ditambahkan
                'detached' => $status['detached'], // ID yang dihapus
                'current'  => $this->getMentorExpertises($mentor) // Daftar keahlian saat ini
            ];
        });
    }
}