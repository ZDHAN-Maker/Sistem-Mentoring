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
            'title'          => $data['title'],
            'description'    => $data['description'] ?? null,
            'video_path'     => $videoPath,
            'thumbnail_path' => null,
            'mentor_id'      => auth()->id(),
            'schedule_id'    => $data['schedule_id'] ?? null,
            'video_size'     => $this->formatBytes($videoFile->getSize()),
            'video_format'   => $videoFile->getClientOriginalExtension(),
            'duration'       => null, // No FFMPEG used
            'status'         => $data['status'] ?? 'draft',
            'order'          => $this->getNextOrder(),
        ]);
    }

    /**
     * Update material.
     */
    public function updateMaterial(Material $material, array $data, $videoFile = null)
    {
        if ($videoFile) {
            $this->deleteFile($material->video_path);

            $videoPath = $this->uploadVideo($videoFile);

            $data['video_path']   = $videoPath;
            $data['video_size']   = $this->formatBytes($videoFile->getSize());
            $data['video_format'] = $videoFile->getClientOriginalExtension();
        }

        $material->update($data);

        return $material->fresh();
    }

    /**
     * Delete material and its associated files.
     */
    public function deleteMaterial(Material $material)
    {
        $this->deleteFile($material->video_path);

        if ($material->thumbnail_path) {
            $this->deleteFile($material->thumbnail_path);
        }

        $material->delete();

        return true;
    }

    /* ============================================
       FILE HANDLING
    ============================================= */

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

    protected function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $i = 0;

        while ($bytes > 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }

    /* ============================================
       ORDER HANDLING
    ============================================= */

    protected function getNextOrder()
    {
        $mentorId = auth()->id();
        if (!$mentorId) return 1;

        $maxOrder = Material::where('mentor_id', $mentorId)->max('order');

        return ($maxOrder ?? 0) + 1;
    }

    /* ============================================
       QUERY
    ============================================= */

    public function getMaterialsByMentor($mentorId)
    {
        return Material::byMentor($mentorId)
            ->ordered()
            ->with('schedule')
            ->get();
    }

    public function reorderMaterials(array $items)
    {
        foreach ($items as $item) {
            Material::where('id', $item['id'])
                ->update(['order' => $item['order']]);
        }

        return true;
    }
}
