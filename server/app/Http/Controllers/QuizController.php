<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class QuizController extends Controller
{
    public function index() 
    {
        // On récupère tous les quiz avec leurs questions et le compteur
        return response()->json(\App\Models\Quiz::with('questions')->withCount('questions')->get(), 200); 
    }

    public function show($id)
    {
        // NOUVELLE MÉTHODE : Indispensable pour que le frontend puisse charger UN quiz spécifique par son ID
        $quiz = Quiz::with('questions')->find($id);
        
        if (!$quiz) {
            return response()->json(['message' => 'Quiz non trouvé'], 404);
        }
        
        return response()->json($quiz, 200);
    }

    public function store(Request $request)
    {
        // 1. création de quiz
        $quiz = \App\Models\Quiz::create([
            'title' => $request->title,
            'description' => $request->description,
            'duration' => $request->duration,
            'access_code' => strtoupper(Str::random(6)), // Génère un code de 6 lettres 
            'user_id' => $request->user_id, // L'ID du prof envoyé par le frontend
        ]);

        // 2. Enregistrement des questions 
        if ($request->has('questions')) {
            foreach ($request->questions as $q) {
                $quiz->questions()->create([
                    'question_text' => $q['question_text'] ?? '',
                    'options' => $q['options'] ?? [], 
                    'correct_answer' => $q['correct_answer'] ?? [],
                ]);
            }
        }

        // 3. On répond au frontend que tout s'est bien passé
        return response()->json($quiz->load('questions')->loadCount('questions'), 201);
    }     
    
    public function update(Request $request, $id)
    {
        $quiz = Quiz::find($id);
        
        if (!$quiz) {
            return response()->json(['message' => 'Quiz non trouvé'], 404);
        }

        // 1. Mise à jour des informations générales du quiz
        $quiz->update([
            'title' => $request->title ?? $quiz->title,
            'description' => $request->description ?? $quiz->description,
            'duration' => $request->duration ?? $quiz->duration,
        ]);

        // 2. Mise à jour des questions 
        if ($request->has('questions')) {
            // On supprime les anciennes questions associées à ce quiz
            $quiz->questions()->delete();

            // On recrée les questions avec les nouvelles modifications reçues
            foreach ($request->questions as $q) {
                $quiz->questions()->create([
                    'question_text' => $q['question_text'] ?? '',
                    'options' => $q['options'] ?? [],
                    'correct_answer' => $q['correct_answer'] ?? [],
                ]);
            }
        }

        // 3. On retourne le quiz complet mis à jour au frontend avec un statut 200
        return response()->json($quiz->load('questions')->loadCount('questions'), 200);
    }
    
    public function destroy($id)
    {
        Quiz::destroy($id);
        return response()->json(['message' => 'Quiz supprimé !']);
    }
}