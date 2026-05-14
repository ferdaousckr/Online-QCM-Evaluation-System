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