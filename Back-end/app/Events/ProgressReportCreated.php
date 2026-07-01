<?php

namespace App\Events;

use App\Models\ProgressReport;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProgressReportCreated
{
    use Dispatchable, SerializesModels;

    public $progressReport;

    public function __construct(ProgressReport $progressReport)
    {
        // Menyimpan data progress report beserta relasi yang dibutuhkan nanti
        $this->progressReport = $progressReport;
    }
}