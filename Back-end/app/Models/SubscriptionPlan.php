<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'price',
        'numeric_price',
        'period',
        'icon',
        'features',
        'button_text',
        'button_style',
        'card_style',
        'is_popular',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'features'   => 'array',
        'is_popular' => 'boolean',
        'is_active'  => 'boolean',
        'numeric_price' => 'integer',
        'sort_order' => 'integer',
    ];
}
