<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::middleware('web')->group(function () {
    // 🔹 CSRF Cookie — wajib sebelum login/logout
    Route::get('/sanctum/csrf-cookie', fn() => response()->noContent());

    // 🔹 Auth routes
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

    // 🔹 Cek user aktif
    Route::get('/user', function (Request $request) {
        return $request->user()
            ? response()->json($request->user())
            : response()->json(['message' => 'Unauthenticated'], 401);
    })->middleware('auth:sanctum');
});
