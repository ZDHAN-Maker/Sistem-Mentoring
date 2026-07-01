<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Exception;

class AuthService
{
    /**
     * Menangani proses registrasi user dan menetapkan role.
     */
    public function registerUser(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'is_active' => true,
            ]);

            $role = Role::where('name', $data['role'])->first();

            if (!$role) {
                throw new Exception("Role '{$data['role']}' tidak ditemukan di sistem.");
            }

            $user->roles()->attach($role->id);

            // token dibuat di dalam transaction yang sama
            $token = $user->createToken('auth_token')->plainTextToken;

            return [
                'user' => $user,
                'token' => $token,
            ];
        });
    }
}
