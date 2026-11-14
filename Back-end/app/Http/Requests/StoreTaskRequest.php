<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        $merge = [];
        if (!$this->has('title') && $this->has('judul')) {
            $merge['title'] = $this->input('judul');
        }
        if (!$this->has('description') && $this->has('deskripsi')) {
            $merge['description'] = $this->input('deskripsi');
        }
        if (!$this->has('type')) {
            $merge['type'] = 'file';
        }
        if (!$this->has('status')) {
            $merge['status'] = 'published';
        }
        if (!empty($merge)) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'pairing_id'  => ['required', 'integer', 'exists:pairings,id'],
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type'        => ['nullable', 'in:file,link,video,text'],
            'due_date'    => ['nullable', 'date'],
            'status'      => ['nullable', 'in:draft,published,closed'],
            'attachment'  => ['nullable', 'file', 'max:20480'],
        ];
    }
}
