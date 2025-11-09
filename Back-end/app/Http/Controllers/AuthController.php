<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * REGISTER (session-aware; auto login)
     * Catatan: route ini harus di web.php (middleware web).
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,mentor,mentee'
        ]);

        // Service hanya membuat user (tanpa token)
        $user = $this->authService->register($validated);

        // Auto-login session
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user'    => $user,
        ], 201);
    }

    /**
     * LOGIN (stateful cookie session)
     * Route: web.php
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (! Auth::attempt($credentials, true)) {
            return response()->json(['message' => 'Email atau password salah'], 401);
        }

        // Mencegah session fixation
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login berhasil',
            'user'    => Auth::user(),
        ], 200);
    }

    /**
     * LOGOUT (stateful)
     * Route: web.php
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout berhasil'], 200);
    }

    /**
     * GET CURRENT USER (protected by auth:sanctum)
     * Route: api.php
     */
    public function getUser(Request $request)
    {
        return response()->json([
            'auth' => true,
            'role' => $request->user()->role ?? null,
            'user' => $request->user(),
        ], 200);
    }
}
