<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * REGISTER (session-based)
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,mentor,mentee'
        ]);

        try {
            // Service membuat user
            $user = $this->authService->register($validated);

            // Auto-login session
            Auth::login($user);
            $request->session()->regenerate();

            return response()->json([
                'message' => 'Registrasi berhasil',
                'user'    => $user,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registrasi gagal',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * LOGIN (session-based)
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = \App\Models\User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }

        // Login session-based
        Auth::login($user, $request->boolean('remember', false));
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login berhasil',
            'user'    => $user,
            'role'    => $user->role,
        ]);
    }


    /**
     * LOGOUT (session-based)
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout berhasil']);
    }


    /**
     * GET CURRENT USER (session-based untuk SPA)
     * Gunakan web middleware, bukan sanctum
     */
    public function getUser(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'auth' => false,
                'message' => 'Not authenticated'
            ], 401);
        }

        return response()->json([
            'auth' => true,
            'role' => $user->role,
            'user' => $user,
        ], 200);
    }
}
