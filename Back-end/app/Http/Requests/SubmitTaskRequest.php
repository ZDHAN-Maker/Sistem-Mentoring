<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class SubmitTaskRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'task_id'    => ['required','integer','exists:tasks,id'],
            'note'       => ['nullable','string','max:1000'],
            'file'       => ['required_without:link','file','max:20480','mimetypes:application/pdf,image/png,image/jpeg,video/mp4'],
            'link'       => ['required_without:file','url','max:500'],
        ];
    }
}
