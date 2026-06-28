<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Material extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'mentor_id', 'pairing_id', 'title', 'description', 'type', 'file_path', 'external_url', 'duration', 'status'
    ];

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    // Materi bisa bersifat general (null pairing) atau spesifik untuk pairing tertentu
    public function pairing(): BelongsTo
    {
        return $this->belongsTo(Pairing::class);
    }
}