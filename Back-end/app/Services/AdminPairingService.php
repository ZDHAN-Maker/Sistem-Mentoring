<?php

namespace App\Services;

use App\Models\Pairing;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AdminPairingService
{
    /**
     * Ambil semua pairing
     */
    public function getAllPairings()
    {
        return Pairing::with(['mentor', 'mentee'])
            ->latest()
            ->get();
    }

    /**
     * Buat pairing mentor ↔ mentee
     */
    public function createPairing($mentorId, $menteeId)
    {
        $mentor = User::findOrFail($mentorId);
        $mentee = User::findOrFail($menteeId);

        if ($mentor->role !== 'mentor') {
            throw ValidationException::withMessages([
                'mentor_id' => 'User bukan mentor'
            ]);
        }

        if ($mentee->role !== 'mentee') {
            throw ValidationException::withMessages([
                'mentee_id' => 'User bukan mentee'
            ]);
        }

        $exists = Pairing::where('mentor_id', $mentorId)
            ->where('mentee_id', $menteeId)
            ->where('status', 'active')
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'pairing' => 'Pairing mentor dan mentee sudah ada'
            ]);
        }

        return Pairing::create([
            'mentor_id' => $mentorId,
            'mentee_id' => $menteeId,
            'status' => 'active',
        ]);
    }

    /**
     * Hapus pairing
     */
    public function deletePairing($pairingId)
    {
        $pairing = Pairing::findOrFail($pairingId);
        $pairing->delete();
    }
}
