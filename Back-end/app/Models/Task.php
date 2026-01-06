<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'pairing_id',
        'mentor_id',
        'mentee_id',
        'judul',
        'deskripsi',
        'file_path',
        'type',
        'status',
    ];

    # Relasi ke Pairing
    public function pairing()
    {
        return $this->belongsTo(Pairing::class);
    }

    # Relasi Mentor
    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    # Relasi Mentee
    public function mentee()
    {
        return $this->belongsTo(User::class, 'mentee_id');
    }

    # Relasi Submission (1 task = banyak submission, tapi biasanya hanya 1 submission per mentee)
    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    # Relasi Jika satu mentee pasti hanya 1 submission
    public function mySubmission()
    {
        return $this->hasOne(Submission::class)->where('mentee_id', auth()->id());
    }
}
