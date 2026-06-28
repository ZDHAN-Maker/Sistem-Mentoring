<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class LearningActivity extends Model
{
    protected $fillable = ['title', 'description'];

    public function mentors(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'mentor_learning_activity', 'learning_activity_id', 'mentor_id')->withTimestamps();
    }
}