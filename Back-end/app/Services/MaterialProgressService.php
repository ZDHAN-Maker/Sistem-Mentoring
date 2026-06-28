<?php

namespace App\Services;

use App\Models\MaterialProgress;
use App\Models\User;
use Exception;

class MaterialProgressService
{
    /**
     * Memperbarui atau membuat record progress belajar Mentee.
     */
    public function upsertProgress(array $data, User $mentee): MaterialProgress
    {
        // Pastikan hanya Mentee yang bisa memperbarui progressnya sendiri
        if (!$mentee->hasRole('Mentee')) {
            throw new Exception("Hanya Mentee yang dapat memperbarui progress belajar.", 403);
        }

        // Cari data progress yang sudah ada, atau buat instance baru jika belum ada
        $progress = MaterialProgress::firstOrNew([
            'material_id' => $data['material_id'],
            'mentee_id' => $mentee->id,
        ]);

        // Update data dasar
        $progress->watch_duration = $data['watch_duration'] ?? $progress->watch_duration ?? 0;
        $progress->progress_percentage = $data['progress_percentage'];

        // Logika Penyelesaian Otomatis (Auto-complete)
        $isManuallyCompleted = isset($data['is_completed']) && $data['is_completed'];
        $isPercentageCompleted = $data['progress_percentage'] >= 100;

        if ($isManuallyCompleted || $isPercentageCompleted) {
            // Jika sebelumnya belum komplit, set waktu komplit saat ini
            if (!$progress->is_completed) {
                $progress->is_completed = true;
                $progress->completed_at = now();
                $progress->progress_percentage = 100; // Pastikan persentase mentok di 100
            }
        } else {
            // Jika progress mundur (misal frontend reset data), pastikan status disesuaikan
            $progress->is_completed = false;
            $progress->completed_at = null;
        }

        $progress->save();

        return $progress;
    }
}