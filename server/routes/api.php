<?php

<<<<<<< HEAD
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ==========================================
// ROUTES D'AUTHENTIFICATION (Si nécessaires)
// ==========================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// ==========================================
// ROUTES DU SYSTEME DE GESTION DES QCM
// ==========================================

/**
 * ⚠️ PRIORITÉ ABSOLUE : La route "join" pour l'étudiant.
 * Elle est placée TOUT EN HAUT pour éviter que Laravel ne confonde le {code} (Ex: WS7YFI) 
 * avec l'ID numérique d'un quiz ({id}).
 */
Route::get('/student/quiz/{code}', [QuizController::class, 'joinQuiz']);

/**
 * Route pour créer un quiz. 
 * Alignée sur ton test réussi : POST http://127.0.0.1:8000/api/quizzes
 */
Route::post('/quizzes', [QuizController::class, 'store']);

/**
 * Récupérer la liste complète de tous les quiz
 */
Route::get('/quizzes', [QuizController::class, 'index']);

/**
 * Récupérer un quiz spécifique par son ID numérique (Ex: /api/quizzes/5)
 */
Route::get('/quizzes/{id}', [QuizController::class, 'show']);

Route::get('/quizzes/{id}/scores', [QuizController::class, 'getQuizScores']);
Route::post('/student/quiz/{id}/submit', [QuizController::class, 'submitQuiz']);

/**
 * Mettre à jour un quiz existant (Modification)
 */
Route::put('/quizzes/{id}', [QuizController::class, 'update']);

/**
 * Supprimer un quiz de la base de données
 */
Route::delete('/quizzes/{id}', [QuizController::class, 'destroy']);


// ==========================================
// ROUTE PAR DÉFAUT (AUTHENTIFICATION LARAVEL)
// ==========================================
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
=======
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\StudentQuizController;

Route::post('/student/quiz/submit/{id}', [StudentQuizController::class, 'submitQuiz']);
Route::get('/student/history', [StudentQuizController::class, 'getStudentHistory']);
>>>>>>> 8661877 (fix(backend): add title column to results migration and setup api routes)
