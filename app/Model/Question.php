<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
       'question_text','points'
    ];


    public function quiz() {
        return $this->belongsTo('App\Quiz','quiz_id');
    }

    public function answers() {
        return $this->hasMany('App\Answer','question_id');
    }
}
