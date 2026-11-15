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
     * Mengakhiri masa pairing dengan opsi evaluasi dan sertifikat
     */
    public function endPairing(Pairing $pairing, array $data = []): Pairing
    {
        $updateData = [
            'status' => 'completed',
            'ended_at' => now(),
        ];

        if (isset($data['completion_status'])) {
            $updateData['completion_status'] = $data['completion_status'];
        }
        if (isset($data['completion_notes'])) {
            $updateData['completion_notes'] = $data['completion_notes'];
        }
        if (isset($data['certificate_eligible'])) {
            $updateData['certificate_eligible'] = (bool) $data['certificate_eligible'];
        }

        $pairing->update($updateData);

        return $pairing;
    }

    /**
     * Memperpanjang masa langganan / durasi bimbingan pairing
     */
    public function extendPairing(Pairing $pairing, array $data): Pairing
    {
        $additionalMonths = (int) ($data['additional_months'] ?? 1);
        if ($additionalMonths < 1) {
            $additionalMonths = 1;
        }

        // Hitung tanggal berakhir baru
        $currentEnd = $pairing->ended_at ? \Carbon\Carbon::parse($pairing->ended_at) : now();
        $baseDate = $currentEnd->isFuture() ? $currentEnd : now();
        $newEnd = (clone $baseDate)->addMonths($additionalMonths);

        $updateData = [
            'duration_months' => ($pairing->duration_months ?? 0) + $additionalMonths,
            'ended_at'        => $newEnd->toDateString(),
            'extended_at'      => now(),
            'status'          => 'active', // Pastikan aktif jika sebelumnya telah selesai
        ];

        if (!empty($data['subscription_plan_id'])) {
            $updateData['subscription_plan_id'] = $data['subscription_plan_id'];
        }
        if (!empty($data['subscription_name'])) {
            $updateData['subscription_name'] = $data['subscription_name'];
        }
        if (!empty($data['notes'])) {
            $notePrefix = $pairing->notes ? $pairing->notes . "\n---\n" : "";
            $updateData['notes'] = $notePrefix . "[" . now()->toDateString() . "] Perpanjangan +" . $additionalMonths . " bulan: " . $data['notes'];
        }

        $pairing->update($updateData);

        return $pairing;
    }
}