<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class GoogleOauthToken extends Model
{
    use HasFactory;


    protected $fillable = [
        'user_id',
        'access_token',
        'refresh_token',
        'expires_at',
        'scope'
    ];


    protected $casts = [
        'expires_at' => 'datetime',
    ];
}
