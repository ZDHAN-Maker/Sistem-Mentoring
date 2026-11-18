<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class GoogleAuthController extends Controller
{
    /**
     * GET /api/auth/google/redirect
     * Mengarahkan ke Google OAuth Consent Screen atau Simulator Mode
     */
    public function redirect(): JsonResponse
    {
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');

        // Jika kredensial Google OAuth nyata telah diisi di .env
        if (!empty($clientId) && !empty($clientSecret) && !str_contains($clientId, 'your-client-id')) {
            try {
                $targetUrl = Socialite::driver('google')
                    ->stateless()
                    ->redirect()
                    ->getTargetUrl();

                return response()->json([
                    'status'     => 'success',
                    'configured' => true,
                    'url'        => $targetUrl,
                ]);
            } catch (Exception $e) {
                // Fallback jika terjadi error pada Socialite
            }
        }

        // Mode Simulator jika kredensial belum dipasang
        return response()->json([
            'status'     => 'simulation',
            'configured' => false,
            'message'    => 'Kredensial GOOGLE_CLIENT_ID belum diisi di .env. Mengaktifkan mode simulator Google SSO.',
        ]);
    }

    /**
     * POST /api/auth/google/callback
     * Menangani callback kode autentikasi resmi dari Google
     */
    public function callback(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        try {
            // Ambil data user dari Google menggunakan authorization code
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            if (!$user) {
                // Buat user baru dengan peran default Mentee
                $user = User::create([
                    'name'              => $googleUser->getName() ?? 'Pengguna Google',
                    'email'             => $googleUser->getEmail(),
                    'google_id'         => $googleUser->getId(),
                    'avatar'            => $googleUser->getAvatar(),
                    'password'          => Hash::make(Str::random(32)),
                    'email_verified_at' => now(),
                    'is_active'         => true,
                ]);

                $menteeRole = Role::firstOrCreate(['name' => 'Mentee']);
                $user->roles()->syncWithoutDetaching([$menteeRole->id]);
            } else {
                // Tautkan google_id jika user mendaftar sebelumnya lewat email biasa
                $updates = [];
                if (!$user->google_id) {
                    $updates['google_id'] = $googleUser->getId();
                }
                if (!$user->avatar && $googleUser->getAvatar()) {
                    $updates['avatar'] = $googleUser->getAvatar();
                }
                if (!empty($updates)) {
                    $user->update($updates);
                }
            }

            $token = $user->createToken('google-auth-token')->plainTextToken;
            $user->load('roles');

            return response()->json([
                'status'  => 'success',
                'message' => 'Autentikasi Google berhasil!',
                'token'   => $token,
                'user'    => $user,
                'roles'   => $user->roles->pluck('name'),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memverifikasi akun dengan Google: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * POST /api/auth/google/simulate
     * Login / Registrasi Google Simulator untuk kebutuhan pengujian lokal
     */
    public function simulate(Request $request): JsonResponse
    {
        $request->validate([
            'email'  => 'required|email',
            'name'   => 'nullable|string',
            'avatar' => 'nullable|string',
            'role'   => 'nullable|string|in:Mentee,Mentor,Admin',
        ]);

        $email = strtolower(trim($request->email));
        $name = $request->name ?: explode('@', $email)[0];
        $selectedRole = $request->role ?: 'Mentee';

        $user = User::where('email', $email)->first();

        if (!$user) {
            $user = User::create([
                'name'              => ucwords(str_replace(['.', '_'], ' ', $name)),
                'email'             => $email,
                'google_id'         => 'google_sim_' . md5($email),
                'avatar'            => $request->avatar ?: "https://ui-avatars.com/api/?name=" . urlencode($name) . "&background=B38867&color=fff",
                'password'          => Hash::make(Str::random(32)),
                'email_verified_at' => now(),
                'is_active'         => true,
            ]);

            $role = Role::firstOrCreate(['name' => $selectedRole]);
            $user->roles()->syncWithoutDetaching([$role->id]);
        } else {
            if (!$user->google_id) {
                $user->update([
                    'google_id' => 'google_sim_' . md5($email),
                ]);
            }
        }

        $token = $user->createToken('google-auth-token')->plainTextToken;
        $user->load('roles');

        return response()->json([
            'status'  => 'success',
            'message' => "Berhasil masuk sebagai {$user->name} via Akun Google!",
            'token'   => $token,
            'user'    => $user,
            'roles'   => $user->roles->pluck('name'),
        ]);
    }
}
