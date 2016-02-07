<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuizResults extends Model
{
    protected $table = 'results';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'quiz_id, user_id'
    ];

    public function quiz() {
        return $this->belongsTo('App\Quiz','quiz_id');
    }

    //the person that took the quiz
    public function user() {
        return $this->belongsTo('App\User','user_id');
    }

    public function answers() {
        return $this->belongsToMany('App\Answer','answers_results','result_id','answer_id');
    }
}
