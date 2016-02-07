<?php
/**
 * Created by PhpStorm.
 * User: Dimitar
 * Date: 1/21/2016
 * Time: 4:59 PM
 */

namespace App;
use DB;
use Carbon;
use Illuminate\Http\JsonResponse;

class QuizService
{



    public function deleteQuiz($quizID) {
        $quiz = \Auth::user()->quizzes()->find($quizID);
        DB::transaction(function () use($quiz) {
            if (!empty($quiz)) {
                foreach($quiz->questions as $question)
                {
                    $question->answers()->delete();
                }
                $quiz->questions()->delete();

                foreach($quiz->results as $result)
                    $result->answers()->detach();

                $quiz->results()->delete();
                $quiz->delete();

             }
        });
    }


    public function getQuiz($quizID) {

//        return DB::table('quizzes')->where('quizzes.id','=',$quizID)
//            //->where('valid_from','<=',Carbon\Carbon::now())
//            //->andWhere('valid_to','>=',Carbon\Carbon::now())
//            ->join('questions','quizzes.id','=','questions.quiz_id')
//            ->join('answers','questions.id','=','answers.question_id')
//            ->select('quizzes.*','questions.*','answers.id','answers.question_id','answers.information','answers.type')
//            ->get();

        $result = Quiz::where('id','=',$quizID)->with('questions.answers')->get();
        foreach($result[0]['questions'] as $question) {
            foreach($question['answers'] as $answer) {
                $answer['is_correct'] = 'null';
                if($answer['type'] == 'text')
                    $answer['information'] = '';

            }
        }
        return $result;
    }


    public function getAllAvailableQuizzes() {
        $today = Carbon\Carbon::now();
        $today = Carbon\Carbon::create($today->year,$today->month,$today->day,0,0,0);
        $quizzes = Quiz::where('valid_from','<=',$today)
            ->where('valid_to','>=',$today)->get();
        foreach($quizzes as $quiz)
        {
            $result = QuizResults::where('quiz_id','=',$quiz->id)->where('user_id','=',\Auth::user()->id)->get();
            if(!empty($result)) {
                $quiz->results = [];
                $quiz->results = $result;
            }
        }

//        $quizzes = Quiz::where('valid_from','<=',$today)
//            ->where('valid_to','>=',$today)->leftJoin('results', function($join) {
//                $join->on('quizzes.id','=','results.quiz_id')->where('results.user_id','=',\Auth::user()->id);
//            })->get();
        return $quizzes;
    }


    public function saveScoreOnQuiz($quizID, $questions) {

        //sorting the questions in ascending order by their ID
        usort($questions, function($a, $b)
        {
            if($a['id'] == $b['id'])
            {
                return 0;
            }
            return $a['id'] < $b['id'] ? -1 : 1;
        });

        //validate if the questions that were sent belong to the selected quiz
        $baseQuestions = Question::where('quiz_id',$quizID)->with('answers')->orderBy('id')->get();

        for($i = 0; $i < count($questions); $i++ )
        {
            $currentQuestion = $questions[$i];
            if($currentQuestion['id'] != $baseQuestions[$i]['id']) {
                return 'Error';
            }

            //validate if the answers belong to the current question
            for($j = 0; $j < count($currentQuestion['answers']); $j++)
            {
                if($currentQuestion['answers'][$j]['id'] != $baseQuestions[$i]['answers'][$j]['id'])
                {
                    return 'Error';
                }
            }
        }


        DB::transaction(function () use($questions, $quizID, $baseQuestions) {
            $results = new QuizResults;
            $results->user_id = \Auth::user()->id;
            $results->quiz_id = $quizID;
            $results->score = 0;
            $results->save();
            for($i = 0; $i < count($questions); $i++ ) {
                for ($j = 0; $j < count($questions[$i]['answers']); $j++) {
                    if ($questions[$i]['answers'][$j]['type'] == 'checkbox' || $questions[$i]['answers'][$j]['type'] == 'radio') {

                        if (!empty($questions[$i]['answers'][$j]['is_selected']) && $questions[$i]['answers'][$j]['is_selected'] == 'true') {
                            $results->answers()->save($baseQuestions[$i]['answers'][$j]);
                        }

                    }

                if($questions[$i]['answers'][$j]['type'] == 'text' && strlen($questions[$i]['answers'][$j]['information']) > 0) {
                    $results->answers()->save($baseQuestions[$i]['answers'][$j],['given_answer'=>$questions[$i]['answers'][$j]['information']]);
                }

                }
            }
        });

    }

    //calculate the score on the quiz
    //$questions - holds the answers and the questions that the user sent
    //$baseQuestions - holds the questions and the answers from the database
    public function calculateScore($questions, $baseQuestions) {
        $totalScore = 0;
        $correctAnswers = 0;
        for($i = 0; $i < count($questions); $i++ ) {
            $currentQuestionPoints = $questions[$i]['points'];
            $numberOfCorrectAnswers = 0;
            $userScore = 0;
            for ($j = 0; $j < count($questions[$i]['answers']); $j++) {

                if ($questions[$i]['answers'][$j]['type'] == 'checkbox' || $questions[$i]['answers'][$j]['type'] == 'radio') {

                    if (!empty($questions[$i]['answers'][$j]['is_selected']) &&
                        $questions[$i]['answers'][$j]['is_selected'] == 'true' &&
                        $baseQuestions[$i]['answers'][$j]['is_correct'] == 'true') {
                        $correctAnswers++;
                    }

                }

                if($questions[$i]['answers'][$j]['type'] == 'text') {
                    //text field is always correct
                    $numberOfCorrectAnswers++;
                 if($questions[$i]['answers'][$j]['information'] == $baseQuestions[$i]['answers'][$j]['information']) {
                     $correctAnswers++;
                 }
                }
                if($baseQuestions[$i]['answers'][$j]['is_correct'] == 'true')
                    $numberOfCorrectAnswers++;

            }
            $totalScore+=$currentQuestionPoints;
            $userScore+=($correctAnswers/$numberOfCorrectAnswers)*$currentQuestionPoints;
        }
        return ($userScore/$totalScore) * 100 ;
    }

    public function getAllResults($quizID) {
        $quiz = \Auth::user()->quizzes()->find($quizID);
        if(empty($quiz))
            return 'Error';

        return $quiz->results()->with('user')->with('quiz')->get();
    }


    public function saveQuiz($data) {

        $quiz = new Quiz;
        $quiz->name = $data->name;
        $quiz->valid_to = $data->valid_to;
        $quiz->category = $data->category;
        $quiz->valid_from = $data->valid_from;
        DB::transaction(function () use($data, $quiz) {


            \Auth::user()->quizzes()->save($quiz);

            foreach($data->questions as $value) {

                $currentQuestion = new Question;
                $currentQuestion->question_text = $value['question_text'];
                if(!empty($currentQuestion->points))
                    $currentQuestion->question_text = $value['points'];

                $quiz->questions()->save($currentQuestion);
                foreach($value['answers'] as $answerValue) {

                    $currentAnswer = new Answer;
                    $currentAnswer->information = $answerValue['information'];
                    $currentAnswer->type = $answerValue['type'];
                    $currentAnswer->is_correct = $answerValue['is_correct'] == "true" ? true : false;

                    $currentQuestion->answers()->save($currentAnswer);


                     }
            }

        });
    }

    public function getResult($resultID) {
        $currentResult = QuizResults::where('id',$resultID)->
        with('quiz.questions.answers')->
        with('user')->get();
        $selectedAnswers = DB::table('answers_results')->where('result_id','=',$resultID)
            ->select('answer_id','given_answer')->get();


        foreach($currentResult[0]['quiz']['questions'] as $question) {
            foreach($question['answers'] as $answer) {

                    foreach($selectedAnswers as $selectedAnswer) {
                        //add the selected answer

                        if($answer['type'] == 'text' && $answer['id'] == $selectedAnswer->answer_id) {
                            $answer['selected'] = $selectedAnswer->given_answer;
                        }
                        elseif($answer['id'] == $selectedAnswer->answer_id) {
                            $answer['selected'] = true;
                        }
                    }
            }
        }
        return $currentResult;

    }


    function savePoints($id, $points) {
        $result = QuizResults::find($id);
        if($result->quiz->creator->id != \Auth::user()->id) {
            return response()->json(['error','You have no permissions to grade this quiz'],400);
        }
        else {
        $result->score = $points;
        $result->is_graded = true;
        $result->save();
        }
    }

}

