<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/


/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['middleware' => ['web']], function () {
    //
});

Route::group(['middleware' => 'web'], function () {
    Route::auth();
    Route::get('/home', 'HomeController@index');
    Route::get('/api', 'HomeController@testStatic');

    Route::get('/api/quizzes', 'QuizController@index');
    Route::get('/api/quizzes/user', 'QuizController@quizzesOwnedByUser');
    Route::get('/api/quizzes/{quizID}','QuizController@getQuiz');
    Route::post('/api/quizzes', 'QuizController@createQuiz');
    Route::delete('/api/quizzes/{quizID}','QuizController@deleteQuiz');

    Route::get('api/quizzes/result/{resultID}','QuizController@getResult');
    Route::post('/api/quizzes/results','QuizController@saveScoreOnQuiz');
    Route::post('/api/quizzes/results/points','QuizController@savePointsOnResult');
    Route::get('api/quizzes/results/{quizID}','QuizController@getResults');




    Route::get('/', function () {
        return view('welcome');
    });

});
