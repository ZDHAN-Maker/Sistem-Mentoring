<?php

namespace App\Services;

use App\Models\Pairing;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class PairingService
{
    /**
     * Membuat pairing baru antara Mentor dan Mentee.
     */
    public function createPairing(array $data): Pairing
    {
        return DB::transaction(function () use ($data) {
            $mentor = User::find($data['mentor_id']);
            $mentee = User::find($data['mentee_id']);

            // 1. Validasi Role (Pastikan ID yang dikirim benar-benar Mentor dan Mentee)
            if (!$mentor || !$mentor->hasRole('Mentor')) {
                throw new Exception("User dengan ID Mentor tersebut tidak ditemukan atau bukan seorang Mentor.");
            }

            if (!$mentee || !$mentee->hasRole('Mentee')) {
                throw new Exception("User dengan ID Mentee tersebut tidak ditemukan atau bukan seorang Mentee.");
            }

            // 2. Validasi Duplikasi (Pastikan Mentee belum memiliki pairing yang 'active')
            $activePairing = Pairing::where('mentee_id', $data['mentee_id'])
                ->where('status', 'active')
                ->first();

            if ($activePairing) {
                throw new Exception("Mentee ini sudah memiliki sesi mentoring yang sedang aktif.");
            }

            // 3. Hitung Durasi dan Tanggal Mulai / Berakhir
            $durationMonths = (int) ($data['duration_months'] ?? 1);
            $startedAt = !empty($data['started_at']) ? \Carbon\Carbon::parse($data['started_at']) : now();
            $endedAt = !empty($data['ended_at']) ? \Carbon\Carbon::parse($data['ended_at']) : (clone $startedAt)->addMonths($durationMonths);

            // 4. Buat Pairing
            return Pairing::create([
                'mentor_id'             => $data['mentor_id'],
                'mentee_id'             => $data['mentee_id'],
                'subscription_plan_id'  => $data['subscription_plan_id'] ?? null,
                'subscription_name'     => $data['subscription_name'] ?? null,
                'duration_months'       => $durationMonths,
                'status'                => 'active', // Status default saat baru dipasangkan
                'started_at'            => $startedAt->toDateString(),
                'ended_at'              => $endedAt->toDateString(),
                'notes'                 => $data['notes'] ?? null,
            ]);
        });
    }

    /**
     * (Opsional) Mengakhiri masa pairing
     */
    public function endPairing(Pairing $pairing): Pairing
    {
        $pairing->update([
            'status' => 'completed', // atau 'inactive'
            'ended_at' => now(),
        ]);

        return $pairing;
    }
}