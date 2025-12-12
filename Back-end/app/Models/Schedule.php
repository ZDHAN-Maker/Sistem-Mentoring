<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'pairing_id',
        'title',
        'description',
        'start_time',
        'end_time',
        'location',
        'status',
    ];

    public function pairing()
    {
        return $this->belongsTo(Pairing::class);
    }
}
