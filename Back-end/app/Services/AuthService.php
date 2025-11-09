<?php

// app/Services/AuthService.php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Cookie;

class AuthService
{
    /**
     * Register user baru
     */
    public function register(array $data)
    {
        // Validasi role jika ada
        $validRoles = ['admin', 'mentor', 'mentee'];
        if (!in_array($data['role'], $validRoles)) {
            throw ValidationException::withMessages([
                'role' => ['Role yang dipilih tidak valid.']
            ]);
        }

        // Buat user baru
        $user = User::create([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'password'  => Hash::make($data['password']),
            'role'      => $data['role'] ?? 'mentee',
        ]);

        // Auto-login setelah register → buat token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // Setel token ke cookie HttpOnly
        $cookie = cookie('token', $token, 60, null, null, false, true); // secure dan HttpOnly

        return [
            'user'  => $user,
            'token' => $token,
            'cookie' => $cookie, // Kirim cookie
        ];
    }

    /**
     * Login user
     */
    public function login(array $credentials)
    {
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Email atau password salah.'
            ], 401);
        }

        $user = Auth::user();

        $token = $user->createToken('auth_token')->plainTextToken;

        // Jangan secure untuk lokal
        $cookie = cookie('token', $token, 60, null, null, false, true);

        return response()->json([
            'message' => 'Login berhasil.',
            'user' => $user,
        ])->withCookie($cookie);
    }

    /**
     * Logout user
     */
    public function logout(User $user)
    {
        // Hapus semua token milik user
        $user->tokens()->delete();

        // Hapus cookie token
        Cookie::queue(Cookie::forget('token'));

        return true;
    }
}
