<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;



Route::group(['middleware' => 'web'], function () {
    Route::get('/sanctum/csrf-cookie', function () {
        return response()->noContent();
    });
});



Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/register', [AuthController::class, 'register']);