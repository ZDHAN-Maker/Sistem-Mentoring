<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'pairing_id' => ['required','integer','exists:pairings,id'],
            'judul'      => ['required','string','max:200'],
            'deskripsi'  => ['nullable','string'],
            'type'       => ['required','in:file,video,link'],
            // opsional: jika mentor lampirkan file materi tugas
            'attachment' => ['nullable','file','max:20480','mimetypes:application/pdf,application/zip,video/mp4,image/png,image/jpeg'],
        ];
    }
}
