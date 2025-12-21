<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Material extends Model
{
    protected $fillable = [
        'title',
        'description',
        'video_path',
        'mentor_id',
        'schedule_id',
        'video_size',
        'video_format',
        'duration',
        'thumbnail_path',
        'status',
        'order'
    ];

    protected $casts = [
        'order' => 'integer',
        'schedule_id' => 'integer'
    ];

    protected $appends = ['video_url'];

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class, 'schedule_id');
    }

    public function learningActivity()
    {
        return $this->belongsTo(LearningActivity::class);
    }

    public function scopeByMentor(Builder $query, $mentorId = null)
    {
        if ($mentorId) {
            return $query->where('mentor_id', $mentorId);
        }

        return $query;
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    public function getVideoUrlAttribute()
    {
        if (!$this->video_path) {
            return null;
        }
        return asset('storage/' . $this->video_path);
    }
}
