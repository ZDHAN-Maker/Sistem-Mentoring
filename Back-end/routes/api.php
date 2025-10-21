<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MenteeController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TaskController;

// Login, Register, Logout
Route::middleware('api')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
});
// Dashboard
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
Route::middleware(['auth:sanctum', 'role:mentor'])->group(function () {
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
    Route::put('/submissions/{submissionId}/review', [TaskController::class, 'review']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::get('/tasks/{task}', [TaskController::class, 'show']);
    Route::post('/tasks/{task}/submit', [TaskController::class, 'submit']);
});
