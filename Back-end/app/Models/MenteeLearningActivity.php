<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenteeLearningActivity extends Model
{
    protected $fillable = [
        'mentee_id',
        'material_id',
        'action'
    ];

    public function mentee()
    {
        return $this->belongsTo(User::class, 'mentee_id');
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}
