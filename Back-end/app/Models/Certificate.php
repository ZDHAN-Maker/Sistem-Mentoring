<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_code',
        'user_id',
        'mentor_id',
        'title',
        'program_track',
        'skkni_reference',
        'grade',
        'competencies',
        'issue_date',
        'expiry_date',
        'status',
        'credential_url',
    ];

    protected $casts = [
        'competencies' => 'array',
        'issue_date'   => 'date',
        'expiry_date'  => 'date',
    ];

    public function mentee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }
}
