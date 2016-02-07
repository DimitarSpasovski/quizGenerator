<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Quiz extends Model
{

   protected $table = 'quizzes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'category', 'valid_from', 'valid_to','points'
    ];

    public function setValidFromAttribute($date) {
        $date = Carbon::parse($date);
    $this->attributes['valid_from'] = Carbon::create($date->year,$date->month,$date->day,0,0,0);
    }
    public function setValidToAttribute($date) {
        $date = Carbon::parse($date);
        $this->attributes['valid_to'] = Carbon::create($date->year,$date->month,$date->day,0,0,0);
    }

    public function creator() {
        return $this->belongsTo('App\User','user_id');
    }
    public function results() {
        return $this->hasMany('App\QuizResults','quiz_id');
    }
    public function questions() {
        return $this->hasMany('App\Question','quiz_id');
    }
}
