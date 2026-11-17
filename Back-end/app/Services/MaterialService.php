<?php

namespace App\Services;

use App\Models\Material;
use App\Models\Pairing;
use App\Models\User;
use App\Services\NotificationService;
use Exception;
use Illuminate\Support\Facades\Storage;

class MaterialService
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Membuat materi baru (bisa umum untuk semua mentee, atau untuk mentee/pairing tertentu).
     */
    public function createMaterials(array $data, User $mentor, $file = null): array
    {
        // 1. Simpan berkas upload jika ada
        $filePath = null;
        if ($file && in_array($data['type'], ['pdf', 'video'])) {
            $filePath = $file->store('materials', 'public');
            $data['file_path'] = $filePath;
        }

        $data['mentor_id'] = $mentor->id;
        $data['status']    = $data['status'] ?? 'published';

        $pairingIds = [];
        if (!empty($data['pairing_ids']) && is_array($data['pairing_ids'])) {
            $pairingIds = array_values(array_filter($data['pairing_ids']));
        } elseif (!empty($data['pairing_id'])) {
            $pairingIds = [$data['pairing_id']];
        }

        // Jika tidak ada pairing_id spesifik (artinya materi umum untuk SEMUA mentee mentor)
        if (empty($pairingIds) || !empty($data['is_general'])) {
            $generalData = $data;
            unset($generalData['pairing_ids'], $generalData['is_general']);
            $generalData['pairing_id'] = null;

            $material = Material::create($generalData);

            // Beri notifikasi ke semua mentee yang sedang aktif bimbingan dengan mentor ini
            try {
                $pairings = Pairing::where('mentor_id', $mentor->id)->with('mentee')->get();
                foreach ($pairings as $p) {
                    if ($p->mentee) {
                        $this->notificationService->sendNotification(
                            $p->mentee,
                            "Materi Baru Diunggah: {$material->title}",
                            "Mentor {$mentor->name} baru saja mengunggah modul materi baru. Silakan akses sekarang di portal pembelajaran.",
                            'new_material',
                            $material
                        );
                    }
                }
            } catch (\Exception $e) {
                // Jangan batalkan proses upload jika notifikasi gagal
            }

            return [$material];
        }

        // Jika ditujukan untuk pairing-pairing tertentu
        $validPairings = Pairing::whereIn('id', $pairingIds)
            ->where('mentor_id', $mentor->id)
            ->with('mentee')
            ->get();

        if ($validPairings->isEmpty()) {
            throw new Exception("Sesi pairing tidak valid atau bukan milik Anda.", 403);
        }

        $created = [];
        foreach ($validPairings as $pairing) {
            $matData = $data;
            unset($matData['pairing_ids'], $matData['is_general']);
            $matData['pairing_id'] = $pairing->id;
            if ($filePath) {
                $matData['file_path'] = $filePath;
            }

            $mat = Material::create($matData);
            $created[] = $mat;

            // Beri notifikasi ke mentee terkait
            try {
                if ($pairing->mentee) {
                    $this->notificationService->sendNotification(
                        $pairing->mentee,
                        "Materi Pembelajaran Baru: {$mat->title}",
                        "Mentor {$mentor->name} membagikan materi khusus: {$mat->title}. Silakan pelajari di portal e-learning.",
                        'new_material',
                        $mat
                    );
                }
            } catch (\Exception $e) {
                // Lanjut jika notifikasi gagal
            }
        }

        return $created;
    }

    /**
     * Membuat materi tunggal (backward compatibility)
     */
    public function createMaterial(array $data, User $mentor, $file = null): Material
    {
        $materials = $this->createMaterials($data, $mentor, $file);
        return $materials[0];
    }

    /**
     * Mengubah data materi.
     */
    public function updateMaterial(Material $material, array $data, User $mentor, $file = null): Material
    {
        // Validasi Kepemilikan
        if ($material->mentor_id !== $mentor->id) {
            throw new Exception("Anda tidak berhak mengubah materi ini.", 403);
        }

        if ($file && in_array($data['type'], ['pdf', 'video'])) {
            if ($material->file_path && Storage::disk('public')->exists($material->file_path)) {
                Storage::disk('public')->delete($material->file_path);
            }
            $data['file_path'] = $file->store('materials', 'public');
        }

        if ($data['type'] === 'link') {
            $data['file_path'] = null;
            if ($material->file_path && Storage::disk('public')->exists($material->file_path)) {
                Storage::disk('public')->delete($material->file_path);
            }
        }

        $material->update($data);
        return $material;
    }

    /**
     * Menghapus materi (Soft Delete).
     */
    public function deleteMaterial(Material $material, User $mentor): void
    {
        if ($material->mentor_id !== $mentor->id) {
            throw new Exception("Anda tidak berhak menghapus materi ini.", 403);
        }

        // Karena model menggunakan SoftDeletes, file aslinya TIDAK dihapus dari storage.
        // Jika ingin menghapus permanen filenya juga, uncomment baris di bawah ini:
        // if ($material->file_path) Storage::disk('public')->delete($material->file_path);

        $material->delete();
    }
}
