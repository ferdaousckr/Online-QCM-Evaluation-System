<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class QuizController extends Controller
{
    public function store(Request $request)
    {
        // 1. création de quiz
        $quiz = Quiz::create([
            'title' => $request->title,
            'access_code' => strtoupper(Str::random(6)), // Génère un code de 6 lettres 
            'user_id' => $request->user_id, // L'ID du prof envoyé par le frontend
        ]);

        // 2. On répond au frontend que tout s'est bien passé
        return response()->json([
            'message' => 'Quiz créé avec succès !',
            'quiz' => $quiz
        ], 201);
    }
    public function update(Request $request, $id)
    {
    $quiz = Quiz::find($id);
    
    if (!$quiz) {
        return response()->json(['message' => 'Quiz non trouvé'], 404);
    }

    $quiz->update([
        'title' => $request->title ?? $quiz->title,
    ]);

    return response()->json([
        'message' => 'Quiz mis à jour !',
        'quiz' => $quiz
    ]);
    }
    public function destroy($id)
    {
    Quiz::destroy($id);
    return response()->json(['message' => 'Quiz supprimé !']);
    }
}