<?php

use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MenteeController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TaskController;

/*
|--------------------------------------------------------------------------
| Sanctum SPA-Compatible API Routes
|--------------------------------------------------------------------------
| Semua route di sini menggunakan session + cookie (bukan token API)
| Middleware wajib: 'web' + EnsureFrontendRequestsAreStateful
| agar request dari frontend (localhost:5173) dikenali sebagai SPA yang valid
*/

Route::middleware(['web', EnsureFrontendRequestsAreStateful::class])->group(function () {

    /**
     * 🟢 Dashboard
     */
    Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('auth:sanctum');

    /**
     * 🟢 Mentee Management
     */
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/mentees', [MenteeController::class, 'index']);
        Route::get('/mentees/{id}', [MenteeController::class, 'show']);
        Route::get('/mentees/{id}/reports', [MenteeController::class, 'reports']);
        Route::get('/mentees/{id}/tasks', [MenteeController::class, 'tasks']);
        Route::post('/mentees/{id}/tasks', [MenteeController::class, 'uploadTask']);
    });

    /**
     * 🟢 Mentor Management
     */
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/mentors', [MentorController::class, 'index']);
        Route::get('/mentors/{id}', [MentorController::class, 'show']);
        Route::get('/mentors/{id}/mentees', [MentorController::class, 'mentees']);
        Route::get('/mentors/{id}/schedules', [MentorController::class, 'schedules']);
        Route::post('/mentors/{id}/tasks', [MentorController::class, 'giveTask']);
        Route::post('/mentors/report/{reportId}/feedback', [MentorController::class, 'giveFeedback']);
        Route::post('/mentors/{id}/materials', [MentorController::class, 'uploadMaterial']);
    });

    /**
     * 🟢 Notifications
     */
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::post('/notifications', [NotificationController::class, 'store']);
        Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    });

    /**
     * 🟢 Tasks - akses umum user login
     */
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/tasks', [TaskController::class, 'index']);
        Route::get('/tasks/{task}', [TaskController::class, 'show']);
        Route::post('/tasks/{task}/submit', [TaskController::class, 'submit']);
    });

    /**
     * 🟡 Tasks - Khusus Role Mentor/Admin
     */
    Route::middleware(['auth:sanctum', 'role:mentor'])->group(function () {
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::put('/tasks/{task}', [TaskController::class, 'update']);
        Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
        Route::put('/submissions/{submissionId}/review', [TaskController::class, 'review']);
    });
});
