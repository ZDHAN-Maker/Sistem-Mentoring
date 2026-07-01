<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Exception;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        try {
            $result = $this->authService->registerUser($request->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Registrasi berhasil.',
                'data' => $result,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Registrasi gagal: ' . $e->getMessage()
            ], 400);
        }
    }

    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        // Verifikasi kredensial secara manual untuk API
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email atau password salah.'
            ], 401); // 401 Unauthorized
        }

        // Cek status aktif
        if (!$user->is_active) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akun Anda telah dinonaktifkan.'
            ], 403); // 403 Forbidden
        }

        // Buat token baru
        $token = $user->createToken('auth_token')->plainTextToken;

        // Ambil role user untuk diberikan ke frontend
        $roles = $user->roles->pluck('name');

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil login.',
            'data' => [
                'user' => $user,
                'roles' => $roles,
                'token' => $token
            ]
        ], 200); // 200 OK
    }

    public function logout(Request $request)
    {
        // Hapus token yang sedang digunakan (Sanctum)
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Anda telah berhasil logout.'
        ], 200);
    }
}
