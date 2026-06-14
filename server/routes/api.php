<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/student/quiz/{code}',         [QuizController::class, 'joinQuiz']);
Route::post('/student/quiz/{code}/submit', [QuizController::class, 'submitQuiz']);
Route::get('/student/history',             [QuizController::class, 'getStudentHistory']);

Route::get   ('/quizzes',             [QuizController::class, 'index']);
Route::post  ('/quizzes',             [QuizController::class, 'store']);
Route::get   ('/quizzes/{id}',        [QuizController::class, 'show']);
Route::put   ('/quizzes/{id}',        [QuizController::class, 'update']);
Route::delete('/quizzes/{id}',        [QuizController::class, 'destroy']);
Route::get   ('/quizzes/{id}/scores', [QuizController::class, 'getQuizScores']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});