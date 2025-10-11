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
     * Register user baru
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'in:admin,mentor,mentee'
        ]);

        $result = $this->authService->register($request->all());

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user'    => $result['user'],
            'token'   => $result['token']
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string'
        ]);

        $result = $this->authService->login($request->only('email', 'password'));

        return response()->json([
            'message' => 'Login berhasil',
            'user'    => $result['user'],
            'token'   => $result['token']
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }
}
