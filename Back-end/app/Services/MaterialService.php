<?php

namespace App\Services;

use App\Models\Material;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MaterialService
{
    /**
     * Create new material.
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
     * Update material.
     */
    public function updateMaterial(Material $material, array $data, $videoFile = null)
    {
        if ($videoFile) {
            // Delete old video if exists
            $this->deleteFile($material->video_path);

            // Upload new video
            $videoPath = $this->uploadVideo($videoFile);

            $data['video_path'] = $videoPath;
        }

        // Only accept fields that exist in the model TABLE
        $material->update([
            'title'      => $data['title'] ?? $material->title,
            'video_path' => $data['video_path'] ?? $material->video_path,
        ]);

        return $material->fresh();
    }

    /**
     * Delete material and its associated files.
     */
    public function deleteMaterial(Material $material)
    {
        $this->deleteFile($material->video_path);

        $material->delete();

        return true;
    }

    protected function uploadVideo($file)
    {
        $name = Str::random(40) . '.' . $file->getClientOriginalExtension();
        return $file->storeAs('materials/videos', $name, 'public');
    }

    protected function deleteFile($path)
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Get materials by mentor.
     */
    public function getMaterialsByMentor($mentorId)
    {
        return Material::where('mentor_id', $mentorId)
            ->orderBy('id', 'asc')
            ->get();
    }

    /**
     * Reorder materials (only if you later add column "order").
     */
    public function reorderMaterials(array $items)
    {
        // Disabled because 'order' is NOT in model anymore
        return true;
    }
}

