<?php

use App\Http\Controllers\MentorExpertiseController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\LearningActivityController;
use App\Http\Controllers\PairingController;
use App\Http\Controllers\MaterialProgressController;
use App\Http\Controllers\ProgressReportController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\MenteeController;
use App\Http\Controllers\SubscriptionPlanController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\PushSubscriptionController;

// ✅ Route tanpa middleware dulu (untuk login/register/publik)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/subscription-plans', [SubscriptionPlanController::class, 'index']);
Route::get('/public/verify-certificate/{code}', [CertificateController::class, 'verify']);

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

    // Profil dan Password user yang sedang login (semua role)
    Route::put('/user/profile', [UserController::class, 'updateMyProfile']);
    Route::put('/user/change-password', [UserController::class, 'changeMyPassword']);
});

Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    // Menampilkan semua pairing
    Route::get('/pairings', [PairingController::class, 'index']);

    // Membuat pairing baru
    Route::post('/pairings', [PairingController::class, 'store']);

    // Mengakhiri masa pairing
    Route::patch('/pairings/{pairing}/complete', [PairingController::class, 'complete']);

    // Memperpanjang masa langganan / durasi pairing
    Route::patch('/pairings/{pairing}/extend', [PairingController::class, 'extend']);

    // Manajemen User
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Daftar Mentor dan Mentee untuk keperluan Admin / Pairing
    Route::get('/mentors', [MentorController::class, 'index']);
    Route::get('/mentees', [MenteeController::class, 'index']);

    // Manajemen Paket Langganan (Admin CRUD)
    Route::post('/subscription-plans', [SubscriptionPlanController::class, 'store']);
    Route::put('/subscription-plans/{id}', [SubscriptionPlanController::class, 'update']);
    Route::delete('/subscription-plans/{id}', [SubscriptionPlanController::class, 'destroy']);
    Route::patch('/subscription-plans/{id}/toggle-active', [SubscriptionPlanController::class, 'toggleActive']);

    // Siaran Pengumuman oleh Admin
    Route::post('/notifications/broadcast', [NotificationController::class, 'broadcast']);
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
        Route::get('/my-mentees', [MentorController::class, 'myMentees']);
        Route::get('/mentors/{id}/mentees', [MentorController::class, 'mentees']);
    });

    // ==========================================
    // AREA MENTEE (Mentee melihat mentor pembimbing)
    // ==========================================
    Route::middleware('role:Mentee')->group(function () {
        Route::get('/my-mentor', [MenteeController::class, 'myMentor']);
    });
});



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

Route::middleware('auth:sanctum')->group(function () {

    // Endpoint Bersama (Daftar & Detail disaring otomatis isinya di layer Service)
    Route::get('/submissions', [SubmissionController::class, 'index']);
    Route::get('/submissions/{id}', [SubmissionController::class, 'show']);

    // Endpoint Khusus Mentee untuk mengumpulkan tugas
    Route::middleware('role:Mentee')->group(function () {
        Route::post('/submissions', [SubmissionController::class, 'store']);
    });

    // Endpoint Khusus Mentor untuk memberikan nilai & feedback
    Route::middleware('role:Mentor')->group(function () {
        Route::patch('/submissions/{id}/review', [SubmissionController::class, 'review']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/mentor/expertises/available', [MentorExpertiseController::class, 'index']);
    Route::middleware('role:Mentor')->group(function () {
        Route::get('/mentor/expertises', [MentorExpertiseController::class, 'myExpertises']);
        Route::post('/mentor/expertises', [MentorExpertiseController::class, 'sync']);
    });
});

Route::middleware('auth:sanctum')->group(function () {

    // Satu rute untuk semua Dashboard (Otomatis membedakan data Admin, Mentor, dan Mentee)
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Sertifikat Digital SKKNI
    Route::get('/certificates', [CertificateController::class, 'index']);
    Route::get('/certificates/{code}', [CertificateController::class, 'show']);
    Route::post('/certificates', [CertificateController::class, 'store']);

    // Direct Messaging / Chat Mentor & Mentee
    Route::get('/chat/contacts', [ChatController::class, 'getContacts']);
    Route::get('/chat/messages/{contactId}', [ChatController::class, 'getMessages']);
    Route::post('/chat/messages', [ChatController::class, 'sendMessage']);
    Route::patch('/chat/messages/{contactId}/read', [ChatController::class, 'markAsRead']);

    // Web Push VAPID Notifications
    Route::post('/push-subscriptions', [PushSubscriptionController::class, 'store']);
    Route::delete('/push-subscriptions', [PushSubscriptionController::class, 'destroy']);
    Route::post('/push-subscriptions/test', [PushSubscriptionController::class, 'sendTestPush']);
});

// VAPID Public Key (Akses Publik untuk Inisialisasi Service Worker)
Route::get('/push-subscriptions/vapid-key', [PushSubscriptionController::class, 'getVapidPublicKey']);
