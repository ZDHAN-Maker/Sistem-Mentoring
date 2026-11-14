<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pairing extends Model
{
    protected $fillable = [
        'mentor_id', 
        'mentee_id', 
        'subscription_plan_id', 
        'subscription_name', 
        'duration_months', 
        'status', 
        'completion_status',
        'completion_notes',
        'certificate_eligible',
        'started_at', 
        'ended_at', 
        'extended_at',
        'notes'
    ];

    protected $casts = [
        'started_at' => 'date',
        'ended_at' => 'date',
        'extended_at' => 'datetime',
        'duration_months' => 'integer',
        'certificate_eligible' => 'boolean',
    ];

    public function subscriptionPlan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class);
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function mentee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentee_id');
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class);
    }

    public function progressReports(): HasMany
    {
        return $this->hasMany(ProgressReport::class);
    }
}
