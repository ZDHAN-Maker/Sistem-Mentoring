<?php

namespace App\Events;

use App\Models\Submission;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SubmissionSubmitted
{
    use Dispatchable, SerializesModels;

    public $submission;

    public function __construct(Submission $submission)
    {
        // Membawa data submission, termasuk relasi task dan mentee di dalamnya
        $this->submission = $submission;
    }
}