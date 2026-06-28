<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MenteeController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\LearningActivityController;
use App\Http\Controllers\PairingController;

// Contoh rute yang hanya untuk Mentor
Route::middleware(['auth:sanctum', 'role:Mentor'])->group(function () {
    Route::post('/mentor/create-task', [TaskController::class, 'store']);
});


// ✅ Route tanpa middleware dulu (untuk login/register)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// ✅ Route yang memerlukan autentikasi
Route::middleware('auth:sanctum')->group(function () {

    // Route untuk Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Mengambil profil user yang sedang login 
    Route::get('/user', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'data' => $request->user()->load('roles')
        ]);
    });
});

Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    // Menampilkan semua pairing
    Route::get('/pairings', [PairingController::class, 'index']);
    
    // Membuat pairing baru
    Route::post('/pairings', [PairingController::class, 'store']);
    
    // Mengakhiri masa pairing
    Route::patch('/pairings/{pairing}/complete', [PairingController::class, 'complete']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    
    // Semua user terautentikasi bisa melihat daftar keahlian
    Route::get('/learning-activities', [LearningActivityController::class, 'index']);

    // ==========================================
    // AREA ADMIN (Manajemen Master Data Keahlian)
    // ==========================================
    Route::middleware('role:Admin')->group(function () {
        Route::post('/learning-activities', [LearningActivityController::class, 'store']);
        Route::put('/learning-activities/{learningActivity}', [LearningActivityController::class, 'update']);
        Route::delete('/learning-activities/{learningActivity}', [LearningActivityController::class, 'destroy']);
        
        // Admin bisa menetapkan keahlian ke Mentor mana saja
        Route::post('/mentors/{mentor}/learning-activities', [LearningActivityController::class, 'syncMentorActivities']);
    });

    // ==========================================
    // AREA MENTOR (Mentor memilih keahliannya sendiri)
    // ==========================================
    Route::middleware('role:Mentor')->group(function () {
        // Mentor menge-post keahlian untuk ID-nya sendiri
        // Disarankan frontend mengirimkan ID user yang sedang login di URL parameter
        Route::post('/my-learning-activities/{mentor}', [LearningActivityController::class, 'syncMentorActivities']);
    });

});