<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuestionController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/quizzes', [QuizController::class, 'store']);
Route::post('/questions', [QuestionController::class, 'store']);
Route::put('/quizzes/{id}', [QuizController::class, 'update']);
Route::put('/questions/{id}', [QuestionController::class, 'update']);
Route::delete('/quizzes/{id}', [QuizController::class, 'destroy']);
Route::delete('/questions/{id}', [QuestionController::class, 'destroy']);

use App\Http\Controllers\AuthController;

// --- Routes Publiques ---
// Ces routes permettent de créer un compte et de se connecter
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Routes Protégées ---
// Seuls les utilisateurs connectés (avec un token) peuvent y accéder
Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
});

