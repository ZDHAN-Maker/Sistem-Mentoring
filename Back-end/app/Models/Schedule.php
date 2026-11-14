<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Schedule extends Model
{
    protected $fillable = [
        'pairing_id', 'title', 'description', 'session_notes', 'location', 'meeting_link', 'start_time', 'end_time', 'status', 'attendance_status'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function pairing(): BelongsTo
    {
        return $this->belongsTo(Pairing::class);
    }
}