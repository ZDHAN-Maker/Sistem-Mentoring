<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'pairing_id',
        'mentee_id',
        'judul',
        'deskripsi',
        'file_path',
        'type',
        'status',
    ];

    public function pairing()
    {
        return $this->belongsTo(Pairing::class);
    }

    public function mentee()
    {
        return $this->belongsTo(User::class, 'mentee_id');
    }
    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
