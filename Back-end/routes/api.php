<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CalendarSyncController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MenteeController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TaskController;

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

// Mentee Management
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/mentees', [MenteeController::class, 'index']);
    Route::get('/mentees/{id}', [MenteeController::class, 'show']);
    Route::get('/mentees/{id}/reports', [MenteeController::class, 'reports']);
    Route::get('/mentees/{id}/tasks', [MenteeController::class, 'tasks']);
    Route::post('/mentees/{id}/tasks', [MenteeController::class, 'uploadTask']);
});

// Mentor Management
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/mentors', [MentorController::class, 'index']);
    Route::get('/mentors/{id}', [MentorController::class, 'show']);
    Route::get('/mentors/{id}/mentees', [MentorController::class, 'mentees']);
    Route::get('/mentors/{id}/schedules', [MentorController::class, 'schedules']);
    Route::post('/mentors/{id}/tasks', [MentorController::class, 'giveTask']);
    Route::post('/mentors/report/{reportId}/feedback', [MentorController::class, 'giveFeedback']);
    Route::post('/mentors/{id}/materials', [MentorController::class, 'uploadMaterial']);
});

// Notification Management
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
});

// Task & Submission Management
Route::middleware('auth:sanctum')->group(function () {

    // ================== TASKS ==================
    Route::get('/tasks', [TaskController::class, 'index']);           // semua task
    Route::get('/tasks/{id}', [TaskController::class, 'show']);       // detail task

    // Mentor hanya (create/update/delete task)
    Route::post('/tasks', [TaskController::class, 'store']);          // buat task
    Route::put('/tasks/{id}', [TaskController::class, 'update']);     // update task
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']); // hapus task

    // ================== SUBMISSIONS ==================
    Route::post('/tasks/{taskId}/submit', [TaskController::class, 'submit']); // mentee submit
    Route::put('/submissions/{submissionId}/review', [TaskController::class, 'review']); // mentor review
});