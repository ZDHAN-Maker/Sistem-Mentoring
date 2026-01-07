<?php

namespace App\Services;

use App\Models\Material;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MaterialService
{
    /**
     * Membuat material baru beserta upload video.
     */
    public function createMaterial(array $data, $videoFile)
    {
        $videoPath = $this->uploadVideo($videoFile);

        return Material::create([
            'mentor_id'  => auth()->id(),    
            'title'      => $data['title'],
            'video_path' => $videoPath,
        ]);
    }

    /**
     * Mengupdate material, termasuk mengganti video jika ada.
     */
    public function updateMaterial(Material $material, array $data, $videoFile = null)
    {
        if ($videoFile) {
            // Hapus video lama
            $this->deleteFile($material->video_path);

            // Upload video baru
            $data['video_path'] = $this->uploadVideo($videoFile);
        }

        // Update hanya field yang valid
        $material->update([
            'title'      => $data['title']      ?? $material->title,
            'video_path' => $data['video_path'] ?? $material->video_path,
        ]);

        return $material->fresh(); // Ambil data terbaru
    }

    /**
     * Menghapus material beserta file video terkait.
     */
    public function deleteMaterial(Material $material)
    {
        // Hapus file video dari storage
        $this->deleteFile($material->video_path);

        // Hapus data material
        $material->delete();

        return true;
    }

    /**
     * Upload file video ke storage/public/materials/videos.
     */
    protected function uploadVideo($file)
    {
        $randomName = Str::random(40) . '.' . $file->getClientOriginalExtension();

        return $file->storeAs('materials/videos', $randomName, 'public');
    }

    /**
     * Menghapus file di storage jika ada.
     */
    protected function deleteFile($path)
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Mengambil semua material milik mentor tertentu.
     */
    public function getMaterialsByMentor($mentorId)
    {
        return Material::where('mentor_id', $mentorId)
            ->orderBy('id', 'asc')
            ->get();
    }

    /**
     * Reorder material (placeholder, karena kolom "order" sudah tidak digunakan).
     */
    public function reorderMaterials(array $items)
    {
        return true; 
    }
}
