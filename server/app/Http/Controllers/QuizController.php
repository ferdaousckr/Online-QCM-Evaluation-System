<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class QuizController extends Controller
{
    public function index() 
    {
        return response()->json(Quiz::with('questions')->withCount('questions')->get(), 200); 
    }

    public function show($id)
    {
        $quiz = Quiz::with('questions')->find($id);
        if (!$quiz) {
            return response()->json(['message' => 'Quiz non trouvé'], 404);
        }
        return response()->json($quiz, 200);
    }

    public function store(Request $request)
    {
        $quiz = Quiz::create([
            'title' => $request->title,
            'description' => $request->description,
            'duration' => $request->duration,
            'access_code' => strtoupper(Str::random(6)),
            'user_id' => $request->user_id,
        ]);

        if ($request->has('questions')) {
            foreach ($request->questions as $q) {
                $quiz->questions()->create([
                    'question_text' => $q['question_text'] ?? $q['text'] ?? '',
                    'time' => $q['time'] ?? 30,
                    'options' => $q['options'] ?? [], 
                    'correct_answer' => $q['correct_answer'] ?? [],
                ]);
            }
        }

        return response()->json($quiz->load('questions')->loadCount('questions'), 201);
    }     
    
    public function update(Request $request, $id)
    {
        $quiz = Quiz::find($id);
        if (!$quiz) {
            return response()->json(['message' => 'Quiz non trouvé'], 404);
        }

        $quiz->update([
            'title' => $request->title ?? $quiz->title,
            'description' => $request->description ?? $quiz->description,
            'duration' => $request->duration ?? $quiz->duration,
        ]);

        if ($request->has('questions')) {
            $quiz->questions()->delete();
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

    public function destroy($id)
    {
        Quiz::destroy($id);
        return response()->json(['message' => 'Quiz supprimé !'], 200);
    }

    public function joinQuiz($code)
    {
        $quiz = Quiz::with('questions')->where('access_code', strtoupper(trim($code)))->first();

        if (!$quiz) {
            return response()->json(['message' => 'Code d\'accès invalide ou quiz introuvable'], 404);
        }

        return response()->json(['quiz' => $quiz], 200);
    }

    public function submitQuiz(Request $request, $code)
    {   
        try {
            $quiz = Quiz::with('questions')->where('access_code', strtoupper(trim($code)))->first();

            if (!$quiz) {
                return response()->json(['success' => false, 'message' => 'Quiz non trouvé'], 404);
            }

            $studentAnswers = $request->input('answers', []); 
            $timeSpent      = $request->input('time_spent', '00:00');
            $totalQuestions = $quiz->questions->count();
            $correctCount   = 0;

         foreach ($quiz->questions as $question) {
            $qId           = (string) $question->id;
            $correctAnswer = (array) $question->correct_answer;

            if (!isset($studentAnswers[$qId])) continue;

             $studentAns = (array) $studentAnswers[$qId];

            $c = $correctAnswer; sort($c);
            $s = $studentAns;    sort($s);

        if ($c === $s) $correctCount++;
}

            $scorePercentage = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100) : 0;
            $scoreSur20      = round(($correctCount / max($totalQuestions, 1)) * 20, 2);

            try {
                $result                  = new Result();
                $result->user_id         = auth()->check() ? auth()->user()->id : 1;
                $result->quiz_id         = $quiz->id;
                $result->title           = $quiz->title;
                $result->total_questions = $totalQuestions;
                $result->correct_answers = $correctCount;
                $result->score_sur_20    = $scoreSur20;
                $result->save();
            } catch (\Exception $dbException) {
                Log::error("Erreur sauvegarde résultat : " . $dbException->getMessage());
            }

            return response()->json([
                'success'         => true,
                'score'           => (int) $scorePercentage,
                'score_sur_20'    => $scoreSur20,
                'correct_answers' => (int) $correctCount,
                'total_questions' => (int) $totalQuestions,
                'time_spent'      => $timeSpent,
            ], 200);

        } catch (\Exception $e) {
            Log::error("Erreur critique submitQuiz : " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erreur interne.', 'error' => $e->getMessage()], 500);
        }
    }

    public function getStudentHistory(Request $request)
    {
        $userId = $request->query('user_id', 1);

        $results = Result::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($r) {
                return [
                    'id'              => $r->id,
                    'title'           => $r->title,
                    'description'     => 'Évaluation QCM',
                    'correct_answers' => $r->correct_answers,
                    'total_questions' => $r->total_questions,
                    'score_sur_20'    => $r->score_sur_20,
                    'date'            => $r->created_at->format('d/m/Y'),
                ];
            });

        return response()->json($results, 200);
    }

    public function getQuizScores($id)
    {
        $results = Result::where('quiz_id', $id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($r) {
                return [
                    'id'              => $r->id,
                    'student_name'    => 'Étudiant #' . $r->user_id,
                    'score'           => round(($r->correct_answers / max($r->total_questions, 1)) * 100),
                    'score_sur_20'    => $r->score_sur_20,
                    'correct_answers' => $r->correct_answers,
                    'total_questions' => $r->total_questions,
                    'completed_at'    => $r->created_at->format('d/m/Y H:i'),
                ];
            });

        return response()->json($results, 200);
    }
}
