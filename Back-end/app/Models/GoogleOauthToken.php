<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'pairing_id',
        'tanggal',
        'keterangan',
    ];

    public function pairing()
    {
        return $this->belongsTo(Pairing::class);
    }

    public function calendarSyncs()
    {
        return $this->hasMany(CalendarSync::class);
    }
}
