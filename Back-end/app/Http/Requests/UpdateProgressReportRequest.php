<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProgressReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'report_date' => ['sometimes', 'required', 'date', 'before_or_equal:today'],
            'note'        => ['sometimes', 'required', 'string', 'min:10'],
        ];
    }
}