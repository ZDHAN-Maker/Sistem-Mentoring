<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'notifiable_id',
        'notifiable_type',
        'status',
    ];

    // timestamps aktif
    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // relasi polymorphic
    public function notifiable()
    {
        return $this->morphTo();
    }
}
