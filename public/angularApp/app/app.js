var quizGenerator = angular.module('quizGenerator', [
  'ui.router',
  'ngResource',
  'pascalprecht.translate',
  'smart-table',
  'mgcrea.ngStrap',
  'toastr',
  'angular-loading-bar',
  'ui.select',
  'ngQuickDate',
    'ngDragDrop'
]);
quizGenerator.config(['$stateProvider','$urlRouterProvider','$httpProvider',function($stateProvider, $urlRouterProvider,$httpProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
      .state('home', {
        url:'/',
        templateUrl:'app/quizzes.html',
        controller:'quizzesController'
      })
      .state('myQuizzes',{
        url: '/myQuizzes',
        templateUrl:'app/myQuizzes.html',
        controller:'myQuizzesController'
      })
      .state('quizCreation',{
        url:'/quizCreate',
        templateUrl:'app/quizCreation.html',
        controller:'quizCreationController'

      })
      .state('viewResults',{
          url:'/viewResults',
          templateUrl:'app/viewResults.html',
          controller: 'viewResultsController',
          params: {quizID : null}
      })
      .state('userResult', {
          url : '/userResult',
          templateUrl : 'app/userResult.html',
          controller : 'userResultController',
          params : {resultID : null}
      })
      .state('takeQuiz', {
          url:'/takeQuiz',
          templateUrl: 'app/takeQuiz.html',
          controller: 'takeQuizController',
          params: {quizID : null}
      });




}
]);
