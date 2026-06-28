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
    public function registerUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
            // 1. Buat User Baru
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'is_active' => true,
            ]);

            // 2. Cari Role berdasarkan input
            $role = Role::where('name', $data['role'])->first();

            if (!$role) {
                throw new Exception("Role '{$data['role']}' tidak ditemukan di sistem.");
            }

            // 3. Pasangkan User dengan Role melalui Pivot Table (user_roles)
            $user->roles()->attach($role->id);

            return $user;
        });
    }
}