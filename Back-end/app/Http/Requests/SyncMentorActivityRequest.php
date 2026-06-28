<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SyncMentorActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Memastikan input adalah array dan setiap ID benar-benar ada di database
            'learning_activity_ids' => ['required', 'array'],
            'learning_activity_ids.*' => ['integer', 'exists:learning_activities,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'learning_activity_ids.*.exists' => 'Salah satu bidang keahlian yang dipilih tidak valid atau tidak ditemukan.'
        ];
    }
}