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
use App\Http\Controllers\MaterialProgressController;
Use App\Http\Controllers\ProgressReportController;

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

use App\Http\Controllers\ScheduleController;

Route::middleware(['auth:sanctum'])->group(function () {
    
    // ==========================================
    // AREA BERSAMA (Mentor & Mentee)
    // ==========================================
    // Melihat daftar jadwal yang terkait dengan diri mereka
    Route::get('/schedules', [ScheduleController::class, 'index']);
    
    // ==========================================
    // AREA MENTOR (Manajemen Jadwal)
    // ==========================================
    Route::middleware('role:Mentor')->group(function () {
        Route::post('/schedules', [ScheduleController::class, 'store']);
        Route::put('/schedules/{schedule}', [ScheduleController::class, 'update']);
        Route::patch('/schedules/{schedule}/status', [ScheduleController::class, 'updateStatus']);
        Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy']);
    });
    
});

Route::middleware(['auth:sanctum'])->group(function () {
    
    // ==========================================
    // AREA BERSAMA (Melihat daftar materi)
    // ==========================================
    Route::get('/materials', [MaterialController::class, 'index']);
    
    // ==========================================
    // AREA MENTOR (Manajemen Materi)
    // ==========================================
    Route::middleware('role:Mentor')->group(function () {
        Route::post('/materials', [MaterialController::class, 'store']);
        
        // Memakai POST untuk mempermudah upload file saat Update (atau minta frontend kirim _method=PUT)
        Route::post('/materials/{material}', [MaterialController::class, 'update']);
        
        Route::delete('/materials/{material}', [MaterialController::class, 'destroy']);
    });
    
});

Route::middleware(['auth:sanctum'])->group(function () {
    
    // ==========================================
    // AREA BERSAMA (Melihat Progress)
    // ==========================================
    Route::get('/material-progress', [MaterialProgressController::class, 'index']);
    
    // ==========================================
    // AREA MENTEE (Tracking Progress)
    // ==========================================
    Route::middleware('role:Mentee')->group(function () {
        // Menggunakan POST karena ini mencakup Create dan Update (Upsert)
        Route::post('/material-progress', [MaterialProgressController::class, 'upsert']);
    });
    
});

Route::middleware('auth:sanctum')->group(function () {
    
    // Endpoint yang bisa diakses bersama (Admin, Mentor, Mentee) dengan batasan data otomatis di Service
    Route::get('/progress-reports', [ProgressReportController::class, 'index']);
    Route::get('/progress-reports/{id}', [ProgressReportController::class, 'show']);

    // Endpoint khusus yang hanya boleh dieksekusi oleh Mentor (Sesuai deskripsi proses aktor)
    Route::middleware('role:Mentor')->group(function () {
        Route::post('/progress-reports', [ProgressReportController::class, 'store']);
        Route::put('/progress-reports/{id}', [ProgressReportController::class, 'update']);
        Route::delete('/progress-reports/{id}', [ProgressReportController::class, 'destroy']);
    });

});

Route::middleware('auth:sanctum')->group(function () {
    
    // Rute utama Notifikasi
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    
    // Rute interaksi Notifikasi menggunakan PATCH (karena hanya mengupdate sebagian field)
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

});

Route::middleware('auth:sanctum')->group(function () {
    
    // Akses bersama: Mentor melihat task buatannya, Mentee melihat task yang ditugaskan kepadanya.
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::get('/tasks/{id}', [TaskController::class, 'show']);

    // Akses khusus Mentor (Membuat, Mengubah, Menghapus Tugas)
    Route::middleware('role:Mentor')->group(function () {
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::put('/tasks/{id}', [TaskController::class, 'update']);
        Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    });

});