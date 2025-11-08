<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * REGISTER
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'in:admin,mentor,mentee'
        ]);

        $user = $this->authService->register($request->all());

        // Login langsung setelah register (opsional)
        Auth::login($user);

        // Regenerasi session untuk keamanan
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user'    => $user,
        ]);
    }

    /**
     * LOGIN
     * Mode: Cookie-based (HTTP-only) — tidak kirim token di body.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Email atau password salah'], 401);
        }

        // Regenerasi session agar aman dari session fixation
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login berhasil',
            'user'    => Auth::user(),
        ]);
    }

    /**
     * LOGOUT
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        // Hapus session & cookie Sanctum
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }

    /**
     * GET CURRENT USER
     */
    public function getUser(Request $request)
    {
        if (Auth::check()) {
            return response()->json([
                'auth' => true,
                'role' => Auth::user()->role,
                'user' => Auth::user(),
            ]);
        }

        return response()->json(['auth' => false]);
    }
}
