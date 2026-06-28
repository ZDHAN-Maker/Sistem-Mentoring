<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // 1. Cek apakah user sudah terautentikasi via Sanctum
        if (!Auth::check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Silakan login terlebih dahulu.'
            ], 401);
        }

        $user = Auth::user();

        // 2. Cek apakah user memiliki salah satu dari role yang diizinkan
        $hasRole = $user->roles()->whereIn('name', $roles)->exists();

        // 3. Jika tidak memiliki akses, berikan respon JSON (bukan abort atau redirect)
        if (!$hasRole) {
            return response()->json([
                'status' => 'forbidden',
                'message' => 'Akses ditolak. Anda tidak memiliki izin untuk melakukan tindakan ini.'
            ], 403);
        }

        return $next($request);
    }
}
