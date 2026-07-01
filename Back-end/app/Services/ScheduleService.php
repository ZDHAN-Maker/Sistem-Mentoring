<?php

namespace App\Services;

use App\Models\Schedule;
use App\Models\Pairing;
use App\Events\ScheduleCreated;
use App\Events\ScheduleUpdated;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ScheduleService
{
    /**
     * Mentor membuat jadwal baru
     */
    public function createSchedule(array $data, User $mentor): Schedule
    {
        // Validasi kepemilikan pairing agar Mentor A tidak bisa membuat jadwal di Pairing B
        $pairing = Pairing::where('id', $data['pairing_id'])
            ->where('mentor_id', $mentor->id)
            ->first();

        if (!$pairing) {
            throw new AuthorizationException('Sesi pairing tidak valid atau bukan milik Anda.');
        }

        // Simpan data jadwal ke database
        $schedule = Schedule::create(array_merge($data, [
            'mentor_id' => $mentor->id
        ]));

        // PICU EVENT: Sistem otomatis menangkap ini dan mengirim notifikasi via background queue
        event(new ScheduleCreated($schedule));

        return $schedule;
    }

    /**
     * Mentor mengubah jadwal (Reschedule)
     */
    public function updateSchedule(int $id, array $data, User $mentor): Schedule
    {
        $schedule = Schedule::find($id);

        if (!$schedule) {
            throw new NotFoundHttpException('Jadwal tidak ditemukan.');
        }

        if ($schedule->mentor_id !== $mentor->id) {
            throw new AuthorizationException('Anda tidak memiliki hak akses untuk mengubah jadwal ini.');
        }

        // Update data jadwal
        $schedule->update($data);

        // PICU EVENT: Beritahu mentee bahwa jadwal di-reschedule
        event(new ScheduleUpdated($schedule));

        return $schedule;
    }
    /**
     * Mengubah status jadwal (misal: selesai atau dibatalkan).
     */
    public function updateStatus(Schedule $schedule, string $status, User $mentor): Schedule
    {
        if ($schedule->pairing->mentor_id !== $mentor->id) {
            throw new AuthorizationException("Anda tidak berhak mengubah status jadwal ini.", 403);
        }

        if (!in_array($status, ['scheduled', 'completed', 'canceled'])) {
            throw new AuthorizationException("Status tidak valid.", 400);
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
            throw new AuthorizationException("Anda tidak berhak menghapus jadwal ini.", 403);
        }

        $schedule->delete();
    }
}
