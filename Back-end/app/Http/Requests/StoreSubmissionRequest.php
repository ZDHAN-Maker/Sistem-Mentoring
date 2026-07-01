<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'task_id'   => ['required', 'integer', 'exists:tasks,id'],
            'file'      => ['nullable', 'file', 'mimes:pdf,doc,docx,zip,png,jpg', 'max:10240'], // Max 10MB
            'answer'    => ['nullable', 'string'],
        ];
    }
}