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
            'pairing_id'   => ['nullable', 'integer', 'exists:pairings,id'],
            'pairing_ids'  => ['nullable', 'array'],
            'pairing_ids.*'=> ['integer', 'exists:pairings,id'],
            'report_date'  => ['required', 'date', 'before_or_equal:today'],
            'note'         => ['required', 'string', 'min:10'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $hasPairingId = !empty($this->input('pairing_id'));
            $hasPairingIds = !empty($this->input('pairing_ids')) && is_array($this->input('pairing_ids')) && count($this->input('pairing_ids')) > 0;

            if (!$hasPairingId && !$hasPairingIds) {
                $validator->errors()->add('pairing_id', 'Pilih minimal satu mentee bimbingan untuk diberikan evaluasi.');
            }
        });
    }
}