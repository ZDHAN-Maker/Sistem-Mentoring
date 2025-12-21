<?php

namespace App\Services;

use App\Models\User;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\ProgressReport;
use App\Models\Pairing;
use Illuminate\Validation\ValidationException;

class MentorService
{
    /**
     * Ambil semua mentor
     */
    public function getAllMentors()
    {
        return User::where('role', 'mentor')->get();
    }

    /**
     * Ambil detail mentor tertentu
     */
    public function getMentorById($id)
    {
        return User::where('role', 'mentor')->findOrFail($id);
    }

    /**
     * Ambil semua mentee milik mentor
     */
    public function getMentorMentees($mentorId)
    {
        $mentor = $this->getMentorById($mentorId);

        $pairings = $mentor->mentorPairings()
            ->with('mentee')
            ->get();

        return $pairings->map(function ($pairing) {
            return [
                'pairing_id' => $pairing->id,
                'status'     => $pairing->status,
                'mentee'     => [
                    'id'    => optional($pairing->mentee)->id,
                    'name'  => optional($pairing->mentee)->name,
                    'email' => optional($pairing->mentee)->email,
                ],
            ];
        });
    }

    /**
     * Ambil semua jadwal mentor
     */
    public function getMentorSchedules($mentorId)
    {
        return Schedule::where('mentor_id', $mentorId)->get();
    }

    /**
     * Buat pairing mentor ↔ mentee
     */
    public function createPairing(array $data)
    {
        $exists = Pairing::where('mentor_id', $data['mentor_id'])
            ->where('mentee_id', $data['mentee_id'])
            ->where('status', 'active')
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'pairing' => 'Pairing mentor dan mentee sudah ada'
            ]);
        }

        return Pairing::create([
            'mentor_id' => $data['mentor_id'],
            'mentee_id' => $data['mentee_id'],
            'status'    => 'active',
        ]);
    }


    /**
     * Buat jadwal mentoring
     */
    public function scheduleMentoring(array $data)
    {
        return Schedule::create([
            'pairing_id' => $data['pairing_id'],
            'schedule_date' => $data['schedule_date'],
        ]);
    }

    /**
     * Berikan tugas
     */
    public function giveTask($mentorId, array $data)
    {
        $pairing = Pairing::where('id', $data['pairing_id'])
            ->where('mentor_id', $mentorId)
            ->firstOrFail();

        return Task::create([
            'pairing_id' => $pairing->id,
            'mentor_id'  => $mentorId,
            'mentee_id'  => $pairing->mentee_id, // ✅ AMAN
            'judul'      => $data['judul'],
            'deskripsi'  => $data['deskripsi'] ?? null,
            'status'     => 'pending',
        ]);
    }


    /**
     * Berikan feedback
     */
    public function giveFeedback($reportId, $feedback)
    {
        $report = ProgressReport::findOrFail($reportId);
        $report->feedback = $feedback;
        $report->save();

        return $report;
    }

    /**
     * Upload materi
     */
    public function uploadMaterial($mentorId, array $data)
    {
        return $mentorId . " upload materi ke: " . $data['file_path'];
    }

    /**
     * Dashboard otomatis
     */
    public function getMentorDashboard($mentorId)
    {
        $mentor = User::findOrFail($mentorId);

        $totalMentee = Pairing::where('mentor_id', $mentorId)->count();
        $totalSession = Schedule::where('mentor_id', $mentorId)->count();
        $completedSession = ProgressReport::where('mentor_id', $mentorId)
            ->where('status', 'submitted')
            ->count();

        return [
            'mentor' => $mentor,
            'program' => "Program default / ambil dari DB kalau ada",
            'totalMentee' => $totalMentee,
            'totalSession' => $totalSession,
            'completedSession' => $completedSession,
            'progress' => $totalSession > 0
                ? round(($completedSession / $totalSession) * 100)
                : 0
        ];
    }
}
