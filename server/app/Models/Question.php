<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['quiz_id', 'question_text', 'time', 'options', 'correct_answer'];

    protected $casts = [
        'options' => 'array',
        'correct_answer' => 'array',
    ];
    
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

}   
