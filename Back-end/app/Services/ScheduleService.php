<?php

namespace App\Services;

use App\Models\Schedule;
use App\Models\Pairing;
use App\Models\User;
use Exception;

class ScheduleService
{
    /**
     * Mentor membuat jadwal baru.
     */
    public function createSchedule(array $data, User $mentor): Schedule
    {
        $pairing = Pairing::find($data['pairing_id']);

        // 1. Validasi Kepemilikan (Apakah Mentor ini yang memiliki pairing tersebut?)
        if ($pairing->mentor_id !== $mentor->id) {
            throw new Exception("Anda tidak memiliki akses untuk membuat jadwal di sesi mentoring ini.", 403);
        }

        // 2. Validasi Status Pairing
        if ($pairing->status !== 'active') {
            throw new Exception("Tidak bisa membuat jadwal. Sesi mentoring ini sudah tidak aktif.", 400);
        }

        // 3. Simpan Jadwal
        $data['status'] = 'scheduled'; // Status default
        return Schedule::create($data);
    }

    /**
     * Mentor mengubah jadwal.
     */
    public function updateSchedule(Schedule $schedule, array $data, User $mentor): Schedule
    {
        if ($schedule->pairing->mentor_id !== $mentor->id) {
            throw new Exception("Anda tidak berhak mengubah jadwal ini.", 403);
        }

        $schedule->update($data);
        return $schedule;
    }

    /**
     * Mengubah status jadwal (misal: selesai atau dibatalkan).
     */
    public function updateStatus(Schedule $schedule, string $status, User $mentor): Schedule
    {
        if ($schedule->pairing->mentor_id !== $mentor->id) {
            throw new Exception("Anda tidak berhak mengubah status jadwal ini.", 403);
        }

        if (!in_array($status, ['scheduled', 'completed', 'canceled'])) {
            throw new Exception("Status tidak valid.", 400);
        }

        $schedule->update(['status' => $status]);
        return $schedule;
    }

    /**
     * Mentor menghapus jadwal.
     */
    public function deleteSchedule(Schedule $schedule, User $mentor): void
    {
        if ($schedule->pairing->mentor_id !== $mentor->id) {
            throw new Exception("Anda tidak berhak menghapus jadwal ini.", 403);
        }

        $schedule->delete();
    }
}