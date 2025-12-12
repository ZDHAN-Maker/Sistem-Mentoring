<?php

namespace App\Services;

use App\Models\Pairing;

class PairingService
{
    /**
     * Ambil semua mentee yang dipairing dengan mentor tertentu
     */
    public function getMenteesByMentorId(int $mentorId)
    {
        return Pairing::with(['mentee'])
            ->where('mentor_id', $mentorId)
            // kalau mau filter hanya yang aktif, buka komentar ini:
            // ->where('status', 'active')
            ->get();
    }
}
