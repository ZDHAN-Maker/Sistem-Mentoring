<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningPath extends Model
{
    protected $fillable = ['title', 'description', 'thumbnail', 'is_published'];

    public function mentors()
    {
        return $this->belongsToMany(
            User::class,
            'learning_path_mentors',
            'path_id',
            'mentor_id'
        );
    }

    public function mentees()
    {
        return $this->belongsToMany(
            User::class,
            'learning_path_mentees',
            'path_id',
            'mentee_id'
        );
    }

    public function activities()
    {
        return $this->hasMany(LearningActivity::class);
    }
}
