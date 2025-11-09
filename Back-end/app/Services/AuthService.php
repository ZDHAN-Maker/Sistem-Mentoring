<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Membuat user baru (tanpa token)
     */
    public function register(array $data): User
    {
        $validRoles = ['admin', 'mentor', 'mentee'];
        if (! in_array($data['role'] ?? 'mentee', $validRoles, true)) {
            throw ValidationException::withMessages([
                'role' => ['Role yang dipilih tidak valid.']
            ]);
        }

        return User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => $data['role'] ?? 'mentee',
        ]);
    }
}
