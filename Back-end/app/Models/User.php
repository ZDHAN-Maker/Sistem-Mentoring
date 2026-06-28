<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'bio',
        'is_active',
        'email_verified_at'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    // Relasi ke Roles
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id')->withTimestamps();
    }

    // Relasi sebagai Mentor di Pairings
    public function mentorPairings(): HasMany
    {
        return $this->hasMany(Pairing::class, 'mentor_id');
    }

    // Relasi sebagai Mentee di Pairings
    public function menteePairings(): HasMany
    {
        return $this->hasMany(Pairing::class, 'mentee_id');
    }

    // Relasi Mentor ke Bidang Keahlian (Learning Activities)
    public function learningActivities(): BelongsToMany
    {
        return $this->belongsToMany(LearningActivity::class, 'mentor_learning_activity', 'mentor_id', 'learning_activity_id')->withTimestamps();
    }

    // Materi yang dibuat oleh Mentor
    public function materials(): HasMany
    {
        return $this->hasMany(Material::class, 'mentor_id');
    }

    // Tugas yang dibuat oleh Mentor
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'mentor_id');
    }

    // Tugas yang dikumpulkan oleh Mentee
    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class, 'mentee_id');
    }

    // Notifikasi milik User
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function materialProgresses(): HasMany
    {
        return $this->hasMany(MaterialProgress::class, 'mentee_id');
    }

    public function hasrole(string $role): bool
    {
        return $this->roles()->where('name', $role)->exists();
    }

    public function hasAnyRole(array $roles): bool
    {
        return $this->roles()->whereIn('name', $roles)->exists();
    }
}
