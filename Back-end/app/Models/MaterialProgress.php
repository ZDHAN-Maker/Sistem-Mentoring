<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialProgress extends Model
{
    protected $table = 'material_progress';

    protected $fillable = [
        'material_id',
        'mentee_id',
        'watch_duration',
        'progress_percentage',
        'is_completed',
        'completed_at',
    ];

    protected $casts = [
        'progress_percentage' => 'decimal:2',
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    /**
     * Relasi ke materi pembelajaran (Material)
     */
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    /**
     * Relasi ke pengguna yang berperan sebagai mentee (User)
     */
    public function mentee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentee_id');
    }
}