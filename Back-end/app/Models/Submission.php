<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'mentee_id',
        'file_path',
        'answer',
        'status',
        'grade',
    ];

    /**
     * Relasi ke Task
     */
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * Relasi ke User (mentee)
     */
    public function mentee()
    {
        return $this->belongsTo(User::class, 'mentee_id');
    }
}
