<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningActivity extends Model
{
    protected $fillable = [
        'learning_path_id',
        'title',
        'description',
        'order'
    ];

    public function learningPath()
    {
        return $this->belongsTo(LearningPath::class);
    }

    public function materials()
    {
        return $this->hasMany(Material::class);
    }
}
