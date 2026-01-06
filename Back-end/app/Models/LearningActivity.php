<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningActivity extends Model
{
    protected $fillable = [
        'learning_path_id',
        'title',
        'description',
    ];

    public function learningPath()
    {
        return $this->belongsTo(LearningPath::class);
    }

    public function materials()
    {
        return $this->hasMany(Material::class, 'learning_activity_id');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('id', 'asc');
        // bisa diganti:
        // return $query->orderBy('created_at', 'asc');
    }
}
