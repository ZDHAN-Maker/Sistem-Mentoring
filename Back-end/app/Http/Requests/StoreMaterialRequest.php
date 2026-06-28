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
            'pairing_id' => ['nullable', 'integer', 'exists:pairings,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'string', 'in:video,pdf,link'],
            
            // Wajib upload file jika tipe adalah video atau pdf (Maksimal 20MB)
            'file' => ['required_if:type,video,pdf', 'file', 'mimes:pdf,mp4,avi,mov', 'max:20480'],
            
            // Wajib isi URL jika tipe adalah link
            'external_url' => ['required_if:type,link', 'nullable', 'url', 'max:255'],
            
            'duration' => ['nullable', 'integer'], // Misalnya durasi dalam menit
            'status' => ['nullable', 'string', 'in:draft,published'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required_if' => 'File wajib diunggah untuk tipe materi PDF atau Video.',
            'external_url.required_if' => 'Tautan eksternal wajib diisi untuk tipe materi Link.'
        ];
    }
}