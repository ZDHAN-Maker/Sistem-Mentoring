<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialProgress extends Model
{
    use HasFactory;

    protected $table = 'material_progress';

    protected $fillable = [
        'material_id',
        'mentee_id',
        'watch_duration',
        'is_completed',
        'completed_at',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    // Relationships
    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function mentee()
    {
        return $this->belongsTo(User::class, 'mentee_id');
    }

    // Methods
    public function markAsCompleted()
    {
        $this->update([
            'is_completed' => true,
            'completed_at' => now(),
        ]);
    }

    public function getProgressPercentageAttribute()
    {
        if (!$this->material->duration) return 0;
        
        return min(100, ($this->watch_duration / $this->material->duration) * 100);
    }
}