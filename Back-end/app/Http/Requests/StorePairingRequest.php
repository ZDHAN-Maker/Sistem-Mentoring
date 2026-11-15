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
            'mentor_id'             => ['required', 'exists:users,id'],
            'mentee_id'             => ['required', 'exists:users,id'],
            'subscription_plan_id'  => ['nullable', 'exists:subscription_plans,id'],
            'subscription_name'     => ['nullable', 'string', 'max:255'],
            'duration_months'       => ['nullable', 'integer', 'min:1', 'max:36'],
            'started_at'            => ['nullable', 'date'],
            'ended_at'              => ['nullable', 'date'],
            'notes'                 => ['nullable', 'string', 'max:500'],
        ];
    }
}