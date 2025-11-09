<?php


use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function () {
    // Register via session (auto-login) — letakkan di web agar session tersedia
    Route::post('/register', [AuthController::class, 'register']);

    // Login/Logout via session cookie
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth');
});