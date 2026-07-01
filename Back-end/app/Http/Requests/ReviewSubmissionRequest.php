<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'grade'    => ['required', 'numeric', 'between:0,100'],
            'feedback' => ['required', 'string', 'min:5'],
            'status'   => ['required', 'in:reviewed,completed'],
        ];
    }
}