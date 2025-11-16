<?php

namespace App\Services;

use App\Models\User;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\ProgressReport;
use App\Models\Pairing;

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
     * Ambil semua mentee yang dimiliki mentor (via tabel Pairing)
     */
    public function getMentorMentees($mentorId)
    {
        // pastikan mentor ada
        $mentor = $this->getMentorById($mentorId);

        // ambil semua pairing milik mentor beserta data mentee-nya
        $pairings = $mentor->mentorPairings()
            ->with('mentee')        
            ->get();

        return $pairings->map(function (Pairing $pairing) {
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
     * Mentor memberikan tugas ke mentee
     */
    public function giveTask($mentorId, array $data)
    {
        return Task::create([
            'pairing_id' => $data['pairing_id'],
            'mentor_id'  => $mentorId,
            'mentee_id'  => $data['mentee_id'],
            'judul'      => $data['judul'],
            'deskripsi'  => $data['deskripsi'] ?? null,
            'status'     => 'pending',
        ]);
    }

    /**
     * Mentor memberi feedback pada report
     */
    public function giveFeedback($reportId, $feedback)
    {
        $report = ProgressReport::findOrFail($reportId);
        $report->feedback = $feedback;
        $report->save();

        return $report;
    }

    /**
     * Mentor mengupload materi (misalnya video, file, dll)
     */
    public function uploadMaterial($mentorId, array $data)
    {
        // sementara masih dummy, nanti bisa diarahkan ke tabel materials
        return $mentorId . " upload materi ke: " . $data['file_path'];
    }
}
