<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Score;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class QuizController extends Controller
{
    /**
     * Récupère tous les quiz avec leurs questions et le compteur associé (Tableau de bord Enseignant).
     */
    public function index() 
    {
        return response()->json(Quiz::with('questions')->withCount('questions')->get(), 200); 
    }

    /**
     * Charge un quiz spécifique par son ID technique.
     */
    public function show($id)
    {
        $quiz = Quiz::with('questions')->find($id);
        
        if (!$quiz) {
            return response()->json(['message' => 'Quiz non trouvé'], 404);
        }
        
        return response()->json($quiz, 200);
    }

    /**
     * Enregistre un nouveau quiz créé par l'enseignant avec ses questions associées.
     */
    public function store(Request $request)
    {
        // 1. Création de l'enregistrement principal du Quiz
        $quiz = Quiz::create([
            'title' => $request->title,
            'description' => $request->description,
            'duration' => $request->duration,
            'access_code' => strtoupper(Str::random(6)), // Génère le code unique de 6 caractères (ex: WS7YFI)
            'user_id' => $request->user_id, // L'ID du professeur envoyé par l'application React
        ]);

        // 2. Enregistrement des questions rattachées
        if ($request->has('questions')) {
            foreach ($request->questions as $q) {
                $quiz->questions()->create([
                    'question_text' => $q['question_text'] ?? $q['text'] ?? '', // Gère les variations d'appellation des clés
                    'time' => $q['time'] ?? 30,
                    'options' => $q['options'] ?? [], 
                    'correct_answer' => $q['correct_answer'] ?? [],
                ]);
            }
        }

        // 3. Retourne le quiz complet avec ses relations chargées à l'état 201 (Created)
        return response()->json($quiz->load('questions')->loadCount('questions'), 201);
    }     
    
    /**
     * Met à jour un quiz existant et rafraîchit sa liste de questions.
     */
    public function update(Request $request, $id)
    {
        $quiz = Quiz::find($id);
        
        if (!$quiz) {
            return response()->json(['message' => 'Quiz non trouvé'], 404);
        }

        // 1. Mise à jour des métadonnées du quiz
        $quiz->update([
            'title' => $request->title ?? $quiz->title,
            'description' => $request->description ?? $quiz->description,
            'duration' => $request->duration ?? $quiz->duration,
        ]);

        // 2. Synchronisation destructive et constructive des questions associées
        if ($request->has('questions')) {
            // Nettoyage des anciennes questions pour éviter les doublons
            $quiz->questions()->delete();

            // Reconstruction complète de la structure mise à jour
            foreach ($request->questions as $q) {
                $quiz->questions()->create([
                    'question_text' => $q['question_text'] ?? $q['text'] ?? '',
                    'time' => $q['time'] ?? 30,
                    'options' => $q['options'] ?? [],
                    'correct_answer' => $q['correct_answer'] ?? [],
                ]);
            }
        }

        return response()->json($quiz->load('questions')->loadCount('questions'), 200);
    }

    /**
     * Supprime définitivement un quiz de l'espace enseignant.
     */
    public function destroy($id)
    {
        Quiz::destroy($id);
        return response()->json(['message' => 'Quiz supprimé !'], 200);
    }

    /**
     * Pour l'étudiant : Récupère le contenu d'un test via son CODE D'ACCÈS unique (ex: QG0PAU).
     */
    public function joinQuiz($code)
    {
        $quiz = Quiz::with('questions')->where('access_code', strtoupper(trim($code)))->first();

        if (!$quiz) {
            return response()->json(['message' => 'Code d\'accès invalide ou quiz introuvable'], 404);
        }

        // Normalisation dynamique à la volée pour s'assurer que React lise toujours .text correctement
        foreach ($quiz->questions as $question) {
            if (!isset($question->text) && isset($question->question_text)) {
                $question->text = $question->question_text;
            }
        }

        return response()->json(['quiz' => $quiz], 200);
    }

    /**
     * Traitement, calcul des résultats et soumission du score final de l'étudiant.
     */
    public function submitQuiz(Request $request, $code)
    {   
        try {
            // 1. Identification du quiz par son code d'accès
            $quiz = Quiz::with('questions')->where('access_code', strtoupper(trim($code)))->first();

            if (!$quiz) {
                return response()->json([
                    'success' => false,
                    'message' => 'Quiz non trouvé pour ce code'
                ], 404);
            }

            $studentAnswers = $request->input('answers', []); 
            $timeSpent = $request->input('time_spent', '02:00');
            $studentName = $request->input('student_name', 'Étudiant Anonyme'); 

            $totalQuestions = $quiz->questions->count();
            $correctAnswersCount = 0;

            // 2. Évaluation des réponses soumises par rapport à la base de données
            foreach ($quiz->questions as $question) {
                $qId = $question->id;
                $correctAnswerValue = $question->correct_answer;
                
                // Si la bonne réponse est sérialisée en chaîne de caractères JSON, on la décode proprement
                if (is_string($correctAnswerValue)) {
                    $decoded = json_decode($correctAnswerValue, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $correctAnswerValue = $decoded;
                    }
                }

                if (isset($studentAnswers[$qId])) {
                    $studentAns = $studentAnswers[$qId];
                    
                    // Comparaison stricte des chaînes nettoyées de leurs espaces superflus
                    if (trim((string)$studentAns) === trim((string)$correctAnswerValue)) {
                        $correctAnswersCount++;
                    }
                }
            }

            // Calcul du pourcentage brut de réussite (ex: 20% ou 80%)
            $scorePercentage = $totalQuestions > 0 ? round(($correctAnswersCount / $totalQuestions) * 100) : 0;

            // 3. Enregistrement sécurisé en base de données dans la table 'scores'
            try {
                $score = new Score();
                $score->quiz_id = $quiz->id;
                
                // Correction de sécurité : évite le crash si l'étudiant passe l'évaluation hors session d'authentification
                $score->student_name = (auth()->check() && auth()->user()->name) ? auth()->user()->name : $studentName; 
                
                $score->score = $scorePercentage;
                $score->time_spent = $timeSpent;
                $score->completed_at = now();
                $score->save();
            } catch (\Exception $dbException) {
                // En cas de problème de structure SQL, l'erreur est consignée sans bloquer le renvoi du résultat au client React
                Log::error("Erreur d'enregistrement du score en DB : " . $dbException->getMessage());
            }

            // 4. RETOUR DU PAYLOAD DE SUCCÈS : Indispensable pour injecter l'affichage de l'écran de fin Figma
            return response()->json([
                'success' => true,
                'score' => (int)$scorePercentage,
                'correct_answers' => (int)$correctAnswersCount,
                'total_questions' => (int)$totalQuestions,
                'time_spent' => $timeSpent
            ], 200);

        } catch (\Exception $globalException) {
            Log::error("Erreur critique lors de submitQuiz : " . $globalException->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Une erreur interne est survenue sur le serveur.',
                'error' => $globalException->getMessage()
            ], 500);
        }
    }

    /**
     * Fournit la liste chronologique des scores obtenus pour alimenter la vue "QuizPreview.jsx" côté enseignant.
     */
    public function getQuizScores($id)
    {
        $scores = Score::where('quiz_id', $id)
                       ->orderBy('completed_at', 'desc')
                       ->get();

        return response()->json($scores, 200);
    }
}