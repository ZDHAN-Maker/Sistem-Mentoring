<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CalendarSyncController;
use App\Http\Controllers\DashboardController;

//Login, Register, Logout
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Calendar Sync
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/calendar/sync', [CalendarSyncController::class, 'sync']);
    Route::put('/calendar/status/{id}', [CalendarSyncController::class, 'updateStatus']);
    Route::get('/calendar/user/{userId}', [CalendarSyncController::class, 'getByUser']);
});

//Dashboard
Route::middleware('auth:sanctum')->get('/dashboard', [DashboardController::class, 'index']);
