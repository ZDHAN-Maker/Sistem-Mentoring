<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgressReport extends Model
{
    protected $fillable = [
        'pairing_id', 'mentor_id', 'report_date', 'note'
    ];

    protected $casts = [
        'report_date' => 'date',
    ];

    public function pairing(): BelongsTo
    {
        return $this->belongsTo(Pairing::class);
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }
}