<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProgressReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Proteksi detail akan ditangani di Service berdasarkan hubungan Mentor-Pairing
    }

    public function rules(): array
    {
        return [
            'pairing_id'  => ['required', 'integer', 'exists:pairings,id'],
            'report_date' => ['required', 'date', 'before_or_equal:today'],
            'note'        => ['required', 'string', 'min:10'],
        ];
    }
}