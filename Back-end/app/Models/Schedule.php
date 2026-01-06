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

    protected $casts = [
        'start_time' => 'datetime',
        'end_time'   => 'datetime',
    ];

    protected $appends = ['scheduled_at'];

    public function pairing()
    {
        return $this->belongsTo(Pairing::class);
    }

    public function materials()
    {
        return $this->hasMany(Material::class);
    }


    public function getScheduledAtAttribute()
    {
        return $this->start_time;
    }
}
