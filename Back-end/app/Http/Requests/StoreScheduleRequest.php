<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Otorisasi detail akan kita tangani di Service
    }

    public function rules(): array
    {
        return [
            'pairing_id' => ['required', 'integer', 'exists:pairings,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'meeting_link' => ['nullable', 'url', 'max:255'],
            // Waktu mulai minimal adalah waktu saat ini
            'start_time' => ['required', 'date', 'after_or_equal:now'],
            // Waktu selesai harus setelah waktu mulai
            'end_time' => ['required', 'date', 'after:start_time'],
        ];
    }

    public function messages(): array
    {
        return [
            'end_time.after' => 'Waktu selesai harus lebih lambat dari waktu mulai.',
            'start_time.after_or_equal' => 'Waktu mulai tidak boleh di masa lalu.',
            'meeting_link.url' => 'Link meeting harus berupa URL yang valid (mengandung http/https).'
        ];
    }
}