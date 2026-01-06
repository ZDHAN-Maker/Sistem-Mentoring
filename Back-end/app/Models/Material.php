<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Material extends Model
{
    protected $fillable = [
        'mentor_id',
        'title',
        'video_path',
    ];

    protected $appends = ['video_url'];

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function progress()
    {
        return $this->hasMany(MaterialProgress::class);
    }

    public function scopeByMentor(Builder $query, int $mentorId)
    {
        return $query->where('mentor_id', $mentorId);
    }
    
    public function scopeOrdered(Builder $query)
    {
        return $query->orderBy('id', 'asc');
        // atau:
        // return $query->latest();
    }

    public function getVideoUrlAttribute()
    {
        return $this->video_path
            ? asset('storage/' . $this->video_path)
            : null;
    }
}
