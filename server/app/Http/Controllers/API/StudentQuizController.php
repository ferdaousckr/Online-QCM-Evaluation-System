<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Result;

class StudentQuizController extends Controller
{
    public function submitQuiz(Request $request, $id)
    {
        $mockQuiz = [
            'id' => 1,
            'questions' => [
                ['id' => 1, 'timeLimit' => 30, 'correct_options' => [0]],
                ['id' => 2, 'timeLimit' => 45, 'correct_options' => [0, 1, 2]],
            ],
        ];

        $userAnswers = $request->input('answers', []);
        $correctCount = 0;
        $totalQuestions = count($mockQuiz['questions']);

        foreach ($mockQuiz['questions'] as $q) {
            $qId = $q['id'];
            $correctOptions = $q['correct_options'];
            $submittedOptions = $userAnswers[$qId] ?? [];

            sort($correctOptions);
            sort($submittedOptions);

            if ($correctOptions === $submittedOptions) {
                $correctCount++;
            }
        }

        $scoreSur20 = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 20, 2) : 0;

        $result = new Result();
        $result->user_id = $request->user()->id ?? 1;
        $result->quiz_id = $id;
        $result->title = "Quiz de Mathématiques";
        $result->correct_answers = $correctCount;
        $result->total_questions = $totalQuestions;
        $result->score_sur_20 = $scoreSur20;
        $result->save();

        return response()->json([
            'success' => true,
            'score_sur_20' => $scoreSur20,
            'correct_answers' => $correctCount,
            'total_questions' => $totalQuestions
        ]);
    }

    public function getStudentHistory(Request $request)
    {
        $userId = $request->user()->id ?? 1;

        $history = Result::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        $formattedHistory = $history->map(function ($res) {
            return [
                'id' => $res->id,
                'title' => $res->title,
                'description' => 'Évaluation QCM',
                'score_brut' => $res->correct_answers . '/' . $res->total_questions,
                'score_sur_20' => $res->score_sur_20,
                'date' => $res->created_at->format('d/m/Y'),
            ];
        });

        return response()->json($formattedHistory);
    }
}