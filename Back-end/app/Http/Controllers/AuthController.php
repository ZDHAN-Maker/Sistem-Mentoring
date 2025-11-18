<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $authService;
    protected $userService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    // Register new user
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,mentor,mentee'
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'],
        ]);

        Auth::login($user);
        $request->session()->regenerate();
        $request->session()->save();

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user'    => $user,
        ], 201);
    }

    // User login
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }

        // Login user
        Auth::login($user, $request->boolean('remember', false));

        // Regenerate session
        $request->session()->regenerate();
        $request->session()->save();

        // Get session ID and create cookie manually
        $sessionId = $request->session()->getId();
        $sessionName = config('session.cookie');

        \Log::info('Login successful', [
            'user_id' => $user->id,
            'session_id' => $sessionId,
            'session_name' => $sessionName,
            'remember' => $request->boolean('remember', false),
        ]);

        // CRITICAL: Return response with cookie
        return response()->json([
            'message' => 'Login berhasil',
            'user'    => $user,
            'role'    => $user->role,
        ])->cookie(
            $sessionName,
            $sessionId,
            config('session.lifetime'),
            config('session.path'),
            config('session.domain'),
            config('session.secure'),
            config('session.http_only'),
            false,
            config('session.same_site')
        );
    }

    // User logout
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout berhasil'], 200);
    }

    // Get authenticated user
    public function getUser(Request $request)
    {
        \Log::info('Get User Request', [
            'has_user' => $request->user() !== null,
            'session_id' => $request->session()->getId(),
            'auth_check' => Auth::check(),
        ]);

        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        return response()->json([
            'auth' => true,
            'user' => $request->user(),
            'role' => $request->user()->role,
        ]);
    }

    // Get authenticated user 
    public function me(Request $request)
    {
        return response()->json(
            $this->userService->getAuthenticatedUser($request)
        );
    }
}
