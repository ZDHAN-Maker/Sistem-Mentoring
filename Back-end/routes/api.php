<?php

use App\Http\Controllers\AdminPairingController;
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
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\LearningPathController;
use Google\Service\MyBusinessAccountManagement\Admin;

// User Profile
Route::middleware('auth:sanctum')->get('/user/me', [UserController::class, 'me']);

// Dashboard
Route::middleware('auth:sanctum')->get('/dashboard', [DashboardController::class, 'index']);

Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
// Schedule 
Route::middleware('auth:sanctum')->group(function () {

    // Semua user yang login bisa melihat schedule
    Route::get('/schedules', [ScheduleController::class, 'index']);
    Route::get('/schedules/{id}', [ScheduleController::class, 'show']);

    // Hanya Admin & Mentor yang boleh CRUD
    Route::middleware('role:admin|mentor')->group(function () {
        Route::post('/schedules', [ScheduleController::class, 'store']);
        Route::put('/schedules/{id}', [ScheduleController::class, 'update']);
        Route::delete('/schedules/{id}', [ScheduleController::class, 'destroy']);
    });
});

// Material Management
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('materials')->group(function () {
        Route::get('/', [MaterialController::class, 'index']);
        Route::post('/', [MaterialController::class, 'store']);
        Route::get('/{material}', [MaterialController::class, 'show']);
        Route::match(['put', 'patch', 'post'], '/{material}', [MaterialController::class, 'update']);
        Route::delete('/{material}', [MaterialController::class, 'destroy']);
        Route::post('/reorder', [MaterialController::class, 'reorder']);
    });
});

// Mentee Management
Route::middleware('auth:sanctum')->group(function () {

    // ======== MENTEE DASHBOARD ========
    Route::get('/mentee/dashboard', [MenteeController::class, 'dashboard']);
    Route::get('/mentee/my-mentor', [MenteeController::class, 'myMentor']);
    Route::get('/mentee/materials', [MenteeController::class, 'materials']);

    // ======== LEARNING ACTIVITIES & TRACKING ========
    Route::get('/mentee/learning-activities', [LearningActivityController::class, 'indexForMentee']);
    Route::get('/mentee/learning-activity/{activityId}/logs', [MenteeController::class, 'activityByLearningActivity']);

    Route::post('/mentee/activity/{materialId}', [MenteeController::class, 'trackActivity']);
    Route::post('/mentee/progress/{materialId}', [MenteeController::class, 'updateWatchProgress']);
    Route::get('/mentee/material-progress', [MenteeController::class, 'materialProgress']);
    Route::get('/mentee/learning-stats', [MenteeController::class, 'learningStats']);

    // ======== ADMIN / MENTOR (AKSES DATA MENTEE) ========
    Route::get('/mentees', [MenteeController::class, 'index']);
    Route::get('/mentees/{id}', [MenteeController::class, 'show']);
    Route::get('/mentees/{id}/reports', [MenteeController::class, 'reports']);
    Route::get('/mentee/tasks', [MenteeController::class, 'myTasks']);
    Route::post('/mentee/tasks/{task}/submit', [MenteeController::class, 'submit']);
    Route::post('/mentees/{id}/tasks', [MenteeController::class, 'uploadTask']);
    Route::get('/mentees/{id}/schedules', [MenteeController::class, 'schedules']);
});

// Mentor Management
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/mentors', [MentorController::class, 'index']);
    Route::get('/mentors/{id}', [MentorController::class, 'show'])
        ->whereNumber('id');
    Route::get('/mentor/mentees', [MentorController::class, 'mentees']);
    Route::get('/mentors/{id}/schedules', [MentorController::class, 'schedules']);
    Route::put('/mentors/schedule/{id}', [MentorController::class, 'updateSchedule']);
    Route::delete('/mentors/schedule/{id}', [MentorController::class, 'deleteSchedule']);
    Route::post('/mentor/tasks', [MentorController::class, 'giveTask']);
    Route::get('/mentors/reports', [MentorController::class, 'reports']);
    Route::post('/mentors/reports/{reportId}/feedback', [MentorController::class, 'giveFeedback']);
    Route::post('/mentors/{mentorId}/materials', [MentorController::class, 'uploadMaterial']);
    Route::post('/mentors/pairing', [MentorController::class, 'createPairing']);
    Route::post('/mentors/schedule', [MentorController::class, 'scheduleMentoring']);
    Route::get('/mentor/dashboard', [MentorController::class, 'dashboard']);
});

// Notification Management
Route::middleware(['auth:sanctum'])
    ->withoutMiddleware('throttle:api')
    ->group(function () {
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

// Task Management
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::get('/tasks/{task}', [TaskController::class, 'show']);
    Route::post('/tasks/{task}/submit', [TaskController::class, 'submit']);
});

// LEARNING ACTIVITIES (ADMIN / MENTOR)
Route::middleware(['auth:sanctum'])->prefix('learning-activities')->group(function () {
    Route::get('/activities', [LearningActivityController::class, 'index']);
    Route::post('/activities', [LearningActivityController::class, 'store']);
    Route::get('/activities/{id}/materials', [LearningActivityController::class, 'getMaterials']);
    Route::post('/activities/{id}/assign-mentor', [LearningActivityController::class, 'assignMentor']);
});

// Admin Management
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/users', [AdminUserController::class, 'index']);
    Route::put('/admin/users/{id}/role', [AdminUserController::class, 'updateRole']);
    Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy']);
    Route::post('/pairings', [AdminPairingController::class, 'store']);
    Route::get('/pairings', [AdminPairingController::class, 'index']);
    Route::delete('/pairings/{id}', [AdminPairingController::class, 'destroy']);
});

// Learning Path Management
Route::middleware(['auth:sanctum', 'admin'])->prefix('learning-paths')->group(function () {

    Route::get('/', [LearningPathController::class, 'index']);
    Route::get('/{id}', [LearningPathController::class, 'show']);

    Route::post('/', [LearningPathController::class, 'store']);
    Route::put('/{id}', [LearningPathController::class, 'update']);
    Route::delete('/{id}', [LearningPathController::class, 'destroy']);

    Route::post('/{id}/assign-mentor', [LearningPathController::class, 'assignMentor']);
    Route::delete('/{id}/mentor/{mentorId}', [LearningPathController::class, 'removeMentor']);
    Route::put('/{id}/replace-mentor', [LearningPathController::class, 'replaceMentor']);

    Route::post('/{id}/assign-mentee', [LearningPathController::class, 'assignMentee']);
});
