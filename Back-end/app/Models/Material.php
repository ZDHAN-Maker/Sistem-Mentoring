<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    public function scopeByMentor($query, $mentorId)
    {
        return $query->where('mentor_id', $mentorId);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }
}
