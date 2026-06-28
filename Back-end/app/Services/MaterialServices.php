<?php

namespace App\Services;

use App\Models\Material;
use App\Models\Pairing;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Storage;

class MaterialService
{
    /**
     * Membuat materi baru.
     */
    public function createMaterial(array $data, User $mentor, $file = null): Material
    {
        // Jika materi spesifik untuk satu pairing, pastikan pairing itu milik mentor ini
        if (isset($data['pairing_id'])) {
            $pairing = Pairing::find($data['pairing_id']);
            if ($pairing->mentor_id !== $mentor->id) {
                throw new Exception("Anda tidak berhak menambahkan materi ke sesi mentoring ini.", 403);
            }
        }

        // Handle File Upload
        if ($file && in_array($data['type'], ['pdf', 'video'])) {
            $path = $file->store('materials', 'public');
            $data['file_path'] = $path;
        }

        $data['mentor_id'] = $mentor->id;
        $data['status'] = $data['status'] ?? 'published'; // Default status

        return Material::create($data);
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

        // Handle File Upload & Hapus File Lama
        if ($file && in_array($data['type'], ['pdf', 'video'])) {
            // Hapus file lama jika ada
            if ($material->file_path && Storage::disk('public')->exists($material->file_path)) {
                Storage::disk('public')->delete($material->file_path);
            }
            // Simpan file baru
            $data['file_path'] = $file->store('materials', 'public');
        }

        // Bersihkan data yang tidak relevan (Misal: dari tipe PDF berubah ke Link)
        if ($data['type'] === 'link') {
            $data['file_path'] = null; // Reset path file
            if ($material->file_path) {
                Storage::disk('public')->delete($material->file_path);
            }
        } else {
            $data['external_url'] = null; // Reset URL jika tipenya file
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