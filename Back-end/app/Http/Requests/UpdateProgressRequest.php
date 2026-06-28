<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProgressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'material_id' => ['required', 'integer', 'exists:materials,id'],
            'watch_duration' => ['nullable', 'integer', 'min:0'], // Waktu dalam detik (opsional)
            'progress_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'is_completed' => ['nullable', 'boolean'],
        ];
    }
}