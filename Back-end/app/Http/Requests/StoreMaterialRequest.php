<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMaterialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pairing_id'   => ['nullable'],
            'pairing_ids'  => ['nullable', 'array'],
            'pairing_ids.*'=> ['integer', 'exists:pairings,id'],
            'is_general'   => ['nullable'],
            'title'        => ['required', 'string', 'max:255'],
            'description'  => ['nullable', 'string'],
            'type'         => ['required', 'string', 'in:video,pdf,link'],
            'file'         => ['nullable', 'file', 'mimes:pdf,mp4,avi,mov,mkv,webm,png,jpg,jpeg', 'max:51200'],
            'external_url' => ['nullable', 'string', 'max:500'],
            'duration'     => ['nullable', 'integer'],
            'status'       => ['nullable', 'string', 'in:draft,published'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $hasFile = $this->hasFile('file');
            $hasUrl = !empty($this->input('external_url'));

            if (!$hasFile && !$hasUrl) {
                $validator->errors()->add('file', 'Unggah berkas dokumen/video atau masukkan tautan URL materi (YouTube / Google Drive).');
            }
        });
    }

    public function messages(): array
    {
        return [
            'file.mimes' => 'Format file yang didukung: PDF, MP4, AVI, MOV, MKV, WEBM, PNG, JPG.',
            'file.max'   => 'Ukuran file maksimal adalah 50MB.',
        ];
    }
}
