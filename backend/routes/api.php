<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\JurusanController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\TeacherSubjectController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    Route::apiResource('users', UserController::class);
    Route::apiResource('classes', ClassController::class);
    Route::apiResource('subjects', SubjectController::class);
    Route::apiResource('teacher-subjects', TeacherSubjectController::class)->only(['index', 'store', 'destroy']);

    Route::get('/jurusans/active', [JurusanController::class, 'active']);
    Route::apiResource('jurusans', JurusanController::class);

    Route::apiResource('teachers', TeacherController::class);

    Route::apiResource('students', StudentController::class);
});
