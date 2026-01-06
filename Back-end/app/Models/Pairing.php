<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProgressReport;

class Pairing extends Model
{
    use HasFactory;

    protected $fillable = [
        'mentor_id',
        'mentee_id',
        'status',
    ];

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function mentee()
    {
        return $this->belongsTo(User::class, 'mentee_id');
    }

    public function progressReports()
    {
        return $this->hasMany(ProgressReport::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'pairing_id', 'id');
    }
}
