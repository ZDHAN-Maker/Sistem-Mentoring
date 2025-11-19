<?php

namespace App\Services;

use App\Models\Material;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MaterialService
{
    public function createMaterial(array $data, $videoFile)
    {
        // Upload video
        $videoPath = $this->uploadVideo($videoFile);
        
        // Get video metadata
        $metadata = $this->getVideoMetadata($videoFile);
        
        // Create material
        $material = Material::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'video_path' => $videoPath,
            'mentor_id' => auth()->id(),
            'schedule_id' => $data['schedule_id'] ?? null,
            'video_size' => $metadata['size'],
            'video_format' => $metadata['format'],
            'duration' => $metadata['duration'] ?? null,
            'status' => $data['status'] ?? 'draft',
            'order' => $data['order'] ?? $this->getNextOrder(),
        ]);

        // Generate thumbnail if needed
        if (isset($data['generate_thumbnail']) && $data['generate_thumbnail']) {
            $this->generateThumbnail($material);
        }

        return $material;
    }

    public function updateMaterial(Material $material, array $data, $videoFile = null)
    {
        if ($videoFile) {
            // Delete old video
            $this->deleteVideo($material->video_path);
            
            // Upload new video
            $videoPath = $this->uploadVideo($videoFile);
            $metadata = $this->getVideoMetadata($videoFile);
            
            $data['video_path'] = $videoPath;
            $data['video_size'] = $metadata['size'];
            $data['video_format'] = $metadata['format'];
            $data['duration'] = $metadata['duration'] ?? null;
        }

        $material->update($data);
        
        return $material->fresh();
    }

    public function deleteMaterial(Material $material)
    {
        // Delete video file
        $this->deleteVideo($material->video_path);
        
        // Delete thumbnail if exists
        if ($material->thumbnail_path) {
            $this->deleteVideo($material->thumbnail_path);
        }
        
        // Soft delete material
        $material->delete();
        
        return true;
    }

    protected function uploadVideo($file)
    {
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('materials/videos', $filename, 'public');
        
        return $path;
    }

    protected function deleteVideo($path)
    {
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    protected function getVideoMetadata($file)
    {
        return [
            'size' => $this->formatBytes($file->getSize()),
            'format' => $file->getClientOriginalExtension(),
            'duration' => null, // Bisa diintegrasikan dengan FFmpeg
        ];
    }

    protected function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }

    protected function getNextOrder()
    {
        return Material::where('mentor_id', auth()->id())->max('order') + 1;
    }

    protected function generateThumbnail(Material $material)
    {
        // Implementasi generate thumbnail menggunakan FFmpeg
        // Placeholder untuk sekarang
        return null;
    }

    public function getMaterialsByMentor($mentorId)
    {
        return Material::byMentor($mentorId)
            ->ordered()
            ->with(['schedule'])
            ->get();
    }

    public function reorderMaterials(array $orderData)
    {
        foreach ($orderData as $item) {
            Material::where('id', $item['id'])
                ->update(['order' => $item['order']]);
        }
        
        return true;
    }
}
