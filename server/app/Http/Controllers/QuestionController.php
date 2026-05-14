<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function store(Request $request)
    {
        // On crée la question en utilisant les données reçues
        $question = Question::create([
            'quiz_id' => $request->quiz_id, // L'ID du quiz qu'on vient de créer
            'question_text' => $request->question_text,
            'options' => $request->options, // Ce sera un tableau (A, B, C, D)
            'correct_answer' => $request->correct_answer,
        ]);

        return response()->json([
            'message' => 'Question ajoutée !',
            'question' => $question
        ], 201);
    }
    public function update(Request $request, $id)
    {
    $question = Question::find($id);

    if (!$question) {
        return response()->json(['message' => 'Question introuvable'], 404);
    }

    $question->update([
        'question_text' => $request->question_text,
        'options' => $request->options,
        'correct_answer' => $request->correct_answer,
    ]);

    return response()->json([
        'message' => 'Question modifiée !',
        'question' => $question
    ]);
    }
    public function destroy($id)
    {
    Question::destroy($id);
    return response()->json(['message' => 'Question supprimée !']);
    }
}