<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'pairing_id'  => ['required', 'integer', 'exists:pairings,id'],
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type'        => ['required', 'in:file,link,video,text'],
            'due_date'    => ['nullable', 'date', 'after:now'],
            'status'      => ['required', 'in:draft,published,closed'],
        ];
    }
}