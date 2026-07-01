<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLearningActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255', 'unique:learning_activities,title'],
            'description' => ['nullable', 'string'],
        ];
    }
}