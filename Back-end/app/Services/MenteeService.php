<?php

namespace App\Services;

use App\Models\User;
use App\Models\ProgressReport;
use App\Models\Task;

class MenteeService
{
    /**
     * Ambil semua mentee
     */
    public function getAllMentees()
    {
        return User::where('role', 'mentee')->get();
    }

    /**
     * Ambil detail mentee tertentu
     */
    public function getMenteeById($id)
    {
        return User::where('role', 'mentee')->findOrFail($id);
    }

    /**
     * Ambil semua report dari mentee
     */
    public function getMenteeReports($menteeId)
    {
        return ProgressReport::where('mentee_id', $menteeId)->get();
    }

    /**
     * Ambil semua tugas mentee
     */
    public function getMenteeTasks($menteeId)
    {
        return Task::where('mentee_id', $menteeId)->get();
    }

    /**
     * Mentee mengupload tugas baru
     */
    public function uploadTask($menteeId, array $data)
    {
        return Task::create([
            'pairing_id' => $data['pairing_id'],
            'mentee_id'  => $menteeId,
            'judul'      => $data['judul'],
            'deskripsi'  => $data['deskripsi'] ?? null,
            'file_path'  => $data['file_path'] ?? null,
            'status'     => 'submitted',
        ]);
    }
}
