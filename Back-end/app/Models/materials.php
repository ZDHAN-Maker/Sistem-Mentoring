<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Material extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'video_path',
        'thumbnail_path',
        'duration',
        'order',
        'status',
        'mentor_id',
        'schedule_id',
        'video_size',
        'video_format',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    // Relationships
    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function progress()
    {
        return $this->hasMany(MaterialProgress::class);
    }

    // Accessors
    public function getVideoUrlAttribute()
    {
        return asset('storage/' . $this->video_path);
    }

    public function getThumbnailUrlAttribute()
    {
        return $this->thumbnail_path 
            ? asset('storage/' . $this->thumbnail_path) 
            : asset('images/default-thumbnail.jpg');
    }

    public function getFormattedDurationAttribute()
    {
        if (!$this->duration) return '00:00';
        
        $minutes = floor($this->duration / 60);
        $seconds = $this->duration % 60;
        
        return sprintf('%02d:%02d', $minutes, $seconds);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeByMentor($query, $mentorId)
    {
        return $query->where('mentor_id', $mentorId);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }
}
