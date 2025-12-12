<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningActivity extends Model
{
    protected $fillable = ['title', 'description'];

    public function mentors()
    {
        return $this->belongsToMany(User::class, 'mentor_learning_activity', 'learning_activity_id', 'mentor_id');
    }

    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    public function mentees()
    {
        return $this->hasMany(User::class, 'learning_activity_id');
    }
}
