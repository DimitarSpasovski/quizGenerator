<?php

namespace App\Http\Controllers;

use App\QuizResults;
use App\QuizService;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;
use App\Quiz;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;


class QuizController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    protected $quizService;

    public function __construct(QuizService $quizService)
    {
        $this->quizService = $quizService;
        $this->middleware('auth');
    }

    //return all quizzes
    public function index(){
        return $this->quizService->getAllAvailableQuizzes();
    }

    public function getResults($quizID) {
        return $this->quizService->getAllResults($quizID);
    }

    public function saveScoreOnQuiz(Request $request) {
        $this->validate($request, [
            'id' => 'required',
            'questions' => 'required',
            'questions.*.answers' => 'required',
            'questions.*.answers.*.id' => 'required',
            'questions.*.answers.*.type' => 'required'
        ]);

      return  $this->quizService->saveScoreOnQuiz($request->id,$request->questions);

    }

    public function getQuiz($quizID) {
        return  $this->quizService->getQuiz($quizID);
    }

    public function deleteQuiz($quizID) {

        $this->quizService->deleteQuiz($quizID);

    }

    public function createQuiz(Request $request) {
        $this->validate($request, [
            'name' => 'required|min:3',
            'category' => 'required|min:2',
            'questions' => 'required',
            'questions.*.question_text' => 'required|min:5',
            'questions.*.answers' => 'required',
            'questions.*.answers.*.information' => 'required|min:1',
            'questions.*.answers.*.type' => 'required'
        ]);
        $this->quizService->saveQuiz($request);

       return $request->questions[0]['answers'][0]['information'];
}

    public function getResult($resultID) {

       return $this->quizService->getResult($resultID);

    }

    public function savePointsOnResult(Request $request) {


        $this->validate($request, [
           'points' => 'required|numeric',
            'id' => 'required|numeric'
        ]);

        return $this->quizService->savePoints($request->id,$request->points);
    }

    //return quizzes owned by the currently logged user
    public function quizzesOwnedByUser() {
        return Auth::user()->quizzes;
    }
}

