<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SyncExpertiseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Proteksi role akan ditangani oleh Middleware
    }

    public function rules(): array
    {
        return [
            'learning_activity_ids'   => ['required', 'array', 'min:1'],
            'learning_activity_ids.*' => ['integer', 'exists:learning_activities,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'learning_activity_ids.required' => 'Pilih minimal satu bidang keahlian.',
            'learning_activity_ids.array'    => 'Format keahlian harus berupa array.',
            'learning_activity_ids.*.exists' => 'Salah satu keahlian yang dipilih tidak valid di sistem.'
        ];
    }
}