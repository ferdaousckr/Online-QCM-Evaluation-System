<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
   
    protected $fillable = ['user_id', 'quiz_id', 'total_questions', 'correct_answers', 'score_sur_20'];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
}