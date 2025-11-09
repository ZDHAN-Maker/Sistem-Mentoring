<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf' => csrf_token()]);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/register', [AuthController::class, 'register']);
