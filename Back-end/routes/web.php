<?php

// routes/web.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return response()->json([
        'message' => 'API Server Running',
        'version' => '1.0',
    ]);
});

Route::middleware('guest')->group(function () {
    Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);

    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Contoh rute dashboard yang dipanggil di AuthService
    Route::middleware('role:Admin')->get('/admin/dashboard', function () {
        return 'Admin Dashboard';
    })->name('admin.dashboard');

    Route::middleware('role:Mentor')->get('/mentor/dashboard', function () {
        return 'Mentor Dashboard';
    })->name('mentor.dashboard');

    Route::middleware('role:Mentee')->get('/mentee/dashboard', function () {
        return 'Mentee Dashboard';
    })->name('mentee.dashboard');
});
