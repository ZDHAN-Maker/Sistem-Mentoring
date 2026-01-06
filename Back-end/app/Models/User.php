<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relasi Mentor dengan Pairing (Jika menggunakan tabel Pairing untuk relasi Mentor-Mentee)
     */
    public function mentorPairings()
    {
        return $this->hasMany(Pairing::class, 'mentor_id');
    }

    /**
     * Relasi Mentee dengan Pairing (Jika menggunakan tabel Pairing untuk relasi Mentor-Mentee)
     */
    public function menteePairings()
    {
        return $this->hasMany(Pairing::class, 'mentee_id');
    }

    /**
     * Relasi ke Notifications (Satu user dapat memiliki banyak notifikasi)
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Relasi ke Tasks (Satu user bisa memiliki banyak tasks sebagai mentee)
     */
    public function tasks()
    {
        return $this->hasMany(Task::class, 'mentee_id');
    }

    /**
     * Relasi ke Submission (Satu user bisa memiliki banyak submissions sebagai mentee)
     */
    public function submissions()
    {
        return $this->hasMany(Submission::class, 'mentee_id');
    }

    /**
     * Relasi ke Schedules (Satu user bisa memiliki banyak jadwal)
     */
    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    /**
     * Relasi ke ProgressReport (Satu user bisa memiliki banyak laporan)
     */
    public function progressReports()
    {
        return $this->hasManyThrough(
            ProgressReport::class,
            Pairing::class,
            'mentee_id',
            'pairing_id',
            'id',
            'id'
        );
    }

    public function learningActivities()
    {
        return $this->hasMany(MenteeLearningActivity::class, 'mentee_id');
    }


    public function assignedActivities()
    {
        return $this->belongsToMany(LearningActivity::class, 'mentor_learning_activity', 'mentor_id');
    }

    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'mentor_id');
    }

    public function learningPaths()
    {
        return $this->belongsToMany(
            LearningPath::class,
            'learning_path_mentees',
            'mentee_id',
            'path_id'
        )->withTimestamps();
    }

    public function materialProgress()
    {
        return $this->hasMany(MaterialProgress::class, 'mentee_id');
    }

    public function uploadedMaterials()
    {
        return $this->hasMany(Material::class, 'mentor_id');
    }
}
