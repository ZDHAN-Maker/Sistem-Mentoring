<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePairingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Asumsinya middleware Role yang akan membatasi siapa yang bisa akses ini (misal: Admin)
    }

    public function rules(): array
    {
        return [
            'mentor_id' => ['required', 'exists:users,id'],
            'mentee_id' => ['required', 'exists:users,id'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}