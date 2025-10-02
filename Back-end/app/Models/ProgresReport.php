<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgressReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'pairing_id',
        'catatan',
        'tanggal',
    ];

    public function pairing()
    {
        return $this->belongsTo(Pairing::class);
    }
}
