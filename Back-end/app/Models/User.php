<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    // Relasi
    public function mentorPairings()
    {
        return $this->hasMany(Pairing::class, 'mentor_id');
    }

    public function menteePairings()
    {
        return $this->hasMany(Pairing::class, 'mentee_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function calendarSyncs()
    {
        return $this->hasMany(CalendarSync::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'mentee_id');
    }
    public function submissions()
    {
        return $this->hasMany(Submission::class, 'mentee_id');
    }
}
