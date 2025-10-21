<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Mendapatkan pengguna yang terautentikasi
        $user = $request->user();

        // Memeriksa apakah pengguna terautentikasi dan apakah role-nya sesuai dengan yang diterima
        if (!$user || !in_array($user->role, $roles)) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        // Melanjutkan permintaan jika role sesuai
        return $next($request);
    }
}
