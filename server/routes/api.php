<?php

<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
use Illuminate\Http\Request;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\AuthController;

<<<<<<< Updated upstream
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/


// ROUTES D'AUTHENTIFICATION (Si nécessaires)

=======
// ==========================================
// ROUTES D'AUTHENTIFICATION
// ==========================================
>>>>>>> Stashed changes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

<<<<<<< Updated upstream

// ROUTES DU SYSTEME DE GESTION DES QCM

=======
// ==========================================
// ROUTES ÉTUDIANT
// ==========================================
>>>>>>> Stashed changes

// PRIORITÉ ABSOLUE : placée avant /quizzes/{id} pour éviter la confusion avec un ID numérique
Route::get('/student/quiz/{code}',        [QuizController::class, 'joinQuiz']);
Route::post('/student/quiz/{code}/submit',[QuizController::class, 'submitQuiz']);
Route::get('/student/history',           [QuizController::class, 'getStudentHistory']);

<<<<<<< Updated upstream
// ROUTE PAR DÉFAUT (AUTHENTIFICATION LARAVEL)

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\StudentQuizController;

Route::post('/student/quiz/submit/{id}', [StudentQuizController::class, 'submitQuiz']);
Route::get('/student/history', [StudentQuizController::class, 'getStudentHistory']);

=======
// ==========================================
// ROUTES PROFESSEUR (CRUD QUIZ)
// ==========================================
Route::get   ('/quizzes',          [QuizController::class, 'index']);
Route::post  ('/quizzes',          [QuizController::class, 'store']);
Route::get   ('/quizzes/{id}',     [QuizController::class, 'show']);
Route::put   ('/quizzes/{id}',     [QuizController::class, 'update']);
Route::delete('/quizzes/{id}',     [QuizController::class, 'destroy']);
Route::get   ('/quizzes/{id}/scores', [QuizController::class, 'getQuizScores']);

// ==========================================
// ROUTE SANCTUM PAR DÉFAUT
// ==========================================
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
>>>>>>> Stashed changes
