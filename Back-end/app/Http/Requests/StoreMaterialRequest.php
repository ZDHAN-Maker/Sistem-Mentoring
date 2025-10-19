<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class StoreMaterialRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title' => ['required','string','max:200'],
            'file'  => ['required','file','max:20480','mimetypes:application/pdf,application/zip,image/png,image/jpeg,video/mp4'],
        ];
    }
}
