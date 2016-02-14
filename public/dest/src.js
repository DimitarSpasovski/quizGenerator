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

/**
 * Created by Dimitar on 1/17/2016.
 */
/**
 * Created by Dimitar on 1/16/2016.
 */
quizGenerator.controller('myQuizzesController',["$scope","$state","$resource","$http","$location",'dateParser',
    function($scope, $state, $resource, $http, $location, dateParser){

    $scope.displayedCollection = [];
    $scope.rowCollection = [];
    $scope.userName = document.getElementById("userName").value;
    $scope.deleteQuizIndex = -1;


        $scope.setDeleteQuizIndex = function(index) {
            $scope.deleteQuizIndex = index;
        }


    $scope.init = function() {
        var quizzes = $resource('/api/quizzes/user');
        $scope.quizzes = quizzes.query(function () {
            for(var i=0; i < $scope.quizzes.length; i++) {
                $scope.quizzes[i].valid_to = dateParser.parseDates($scope.quizzes[i].valid_to);
            }
            $scope.rowCollection = $scope.quizzes;
            $scope.displayedCollection = [].concat($scope.quizzes);
            $scope.predicates = ['name', 'category', 'valid_to'];
            $scope.selectedPredicate = $scope.predicates[0];

        });
    }

   $scope.init();

    $scope.deleteQuiz = function() {
        $http.delete('api/quizzes/'+$scope.deleteQuizIndex).success(function(data) {

            $scope.init();

        })
            .error(function(data) {
                alert('Errror');
                console.log(data);
            })
    }

    $scope.viewResults = function($quizID) {
            $location.search('quizID',$quizID);
            $location.path('/viewResults');
        }

    $scope.createQuiz = function() {
        $location.path('/quizCreate');
    }

}]);

/**
 * Created by Dimitar on 1/18/2016.
 */
/**
 * Created by Dimitar on 1/16/2016.
 */
quizGenerator.controller('quizCreationController',["$scope","$state","$resource","$http","$location",
    function($scope, $state,$resource,$http, $location){
 $scope.currentQuiz = {};
 $scope.quizQuestions = [];
 $scope.currentIndex = 0;
 $scope.currentQuestion = {};

 $scope.finalResult = false;
 $scope.isSuccesful = false;
    $scope.quizQuestions.push($scope.currentQuestion);
    $scope.currentAnswers = [];
    $scope.currentAnswer = {}; //current answer
    $scope.currentQuestion.answers = $scope.currentAnswers;
    $scope.answerTypes = [
     'Radio button answer',
     'Checkbox answer',
     'Textbox answer'
    ];


    $scope.deleteCurrentQuestion = function() {
        if($scope.currentIndex != 0)
        {
            $scope.quizQuestions.splice($scope.currentIndex,1);
            $scope.goToQuestion($scope.currentIndex-1);

        }
    }

    $scope.goToQuestion = function(index) {
        $scope.currentQuestion = $scope.quizQuestions[index];
        $scope.currentAnswers = $scope.currentQuestion.answers;
        $scope.currentIndex = index;
    }

    $scope.deleteAnswer = function(index)
    {
        $scope.currentAnswers.splice(index,1);
        $scope.$apply();
    };


    $scope.createNewQuestion = function() {
        $scope.currentQuestion.answers = $scope.currentAnswers;
        $scope.currentQuestion = {};
        $scope.currentAnswers = [];
        $scope.currentQuestion.answers = $scope.currentAnswers;
        $scope.currentAnswer = {}; //current answer
        $scope.quizQuestions.push($scope.currentQuestion);
        $scope.currentIndex = $scope.quizQuestions.length - 1;
    }

    $scope.generateAnswer = function(answerType){
       var newAnswer = {};
        if(answerType === $scope.answerTypes[0]) //radiobutton
        {
            newAnswer.type = 'radio';
        }
        else if(answerType === $scope.answerTypes[1])
        {
            newAnswer.type = 'checkbox';
        }
        else if(answerType === $scope.answerTypes[2])
        {
            newAnswer.type = 'text';
        }
        newAnswer.information = '';
        newAnswer.is_correct = false;
        $scope.currentAnswer = newAnswer;
        $scope.currentAnswers.unshift($scope.currentAnswer);
        $scope.$apply();
        //console.log($scope.currentAnswers);
    }

    //jquery

    $(function(){
        $("#sortable2").sortable({
            cancel: "li"
        }).disableSelection();
        $("#sortable1").sortable({
            connectWith: "#sortable2",
            remove: function(event, ui) {
                console.log(ui.item.html());
                $scope.generateAnswer(ui.item.html());
            $(this).sortable('cancel');
            }

    });
    });

    //remove the focus on buttons after clicking
    $(".btn").mouseup(function(){
        $(this).blur();
    })

    $scope.createQuiz = function() {

       $scope.currentQuiz.questions = $scope.quizQuestions;
        $scope.errors = $scope.validate();
        console.log(JSON.stringify($scope.currentQuiz));
        if($scope.errors.length == 0) {

            $http.post("/api/quizzes",JSON.stringify($scope.currentQuiz)).success(function (data) {
                console.log('Success!');
                console.log(data);
                $scope.finalResult = true;
                $scope.isSuccesful = true;
                $location.path('/myQuizzes');
            })
                .error(function (data) {
                    console.log('Error');
                    console.log(data);
                    if(data.name != undefined) {
                        for(var i = 0; i < data.name.length; i++)
                        $scope.errors.push(data.name[i]);
                    }
                    if(data.category != undefined) {
                            for(i = 0; i < data.category.length; i++)
                                $scope.errors.push(data.category[i]);
                    }
                   if($scope.errors.length == 0 )
                   {
                       $scope.errors.push('Questions cannot be empty and must have a length of at least 5 characters.');
                       $scope.errors.push('Answers cannot be empty.');
                   }

                   
                    $scope.finalResult = true;
                    $scope.isSuccesful = false;
                });
        }
        else {
            $scope.finalResult = true;
            $scope.isSuccesful = false;
        }

    };

    $scope.validate = function() {
        var errors = [];

        if($scope.currentQuiz.name==undefined || $scope.currentQuiz.name.trim() == '') {
            errors.push('The quiz name is empty.');
        }
        if($scope.currentQuiz.category == undefined || $scope.currentQuiz.category.trim() == '') {
            errors.push('The quiz category is empty.');
        }
        for(var i = 0; i < $scope.currentQuiz.questions.length; i++)
        {
            var currentQuestion = $scope.currentQuiz.questions[i];
            if(currentQuestion.question_text == undefined || currentQuestion.question_text.trim() == '')
            {
                errors.push('Question '+(i+1)+' is empty.');
            }
            if(currentQuestion.answers == undefined || currentQuestion.answers.length == 0)
            {
                errors.push('Question '+(i+1)+' has no answers.');
            }

            for(var j = 0; j < currentQuestion.answers.length; j++)
            {
                var currentAnswer = currentQuestion.answers[j];
                if(currentAnswer.information == undefined || currentAnswer.information.trim() == '')
                {
                    errors.push('Answer '+(j+1)+' from Question '+(i+1)+' is empty.');
                }
            }
        }
        return errors;
    }


        var today =  new Date();

        var tomorrow = new Date(new Date().setDate(new Date().getDate()+1));
        $("#valid_from").datepicker({defaultDate : today});
        $("#valid_to").datepicker({defaultDate : tomorrow});



    $scope.currentQuiz.valid_from = $.datepicker.formatDate("mm/dd/yy", today);
    $scope.currentQuiz.valid_to = $.datepicker.formatDate("mm/dd/yy", tomorrow);
}]);

/**
 * Created by Dimitar on 1/16/2016.
 */
quizGenerator.controller('quizzesController',["$scope","$state","$resource",'$location','dateParser',"$http",
    function($scope, $state,$resource,$location, dateParser, $http){

    $scope.displayedCollection = [];
    $scope.rowCollection = [];
    $scope.quizzes = [];

     $http.get('/api/quizzes').success(function(data) {
         console.log(data);
         $scope.quizzes = data;
        for(var i=0; i < $scope.quizzes.length; i++) {
            $scope.quizzes[i].valid_to = dateParser.parseDates($scope.quizzes[i].valid_to);
        }
        $scope.rowCollection = $scope.quizzes;
        $scope.displayedCollection = [].concat($scope.quizzes);
        $scope.predicates = ['name', 'category', 'valid_to'];
        $scope.selectedPredicate = $scope.predicates[0];
        $('.disabledAnchors').click(function(e){
            e.preventDefault();
        })
    })
         .error(function(data) {
             console.log('Error');
             console.log(data);
         })

    $scope.takeQuiz = function(index) {
       //$state.go('takeQuiz',{quizID:index});
       // return false;
        $location.search('quizID',index);
        $location.path('/takeQuiz');
    }


}]);
/**
 * Created by Dimitar on 1/24/2016.
 */
quizGenerator.controller('takeQuizController',["$scope","$state","$http","$stateParams","$location",function($scope, $state, $http
,$stateParams, $location){

    $scope.quizID = $location.search().quizID;
    $scope.currentQuiz = {};
    $scope.currentQuestion = {};
    $scope.currentIndex = 0;

    $scope.init = function() {
        $scope.currentQuestion = $scope.currentQuiz.questions[0];
        $scope.currentIndex = 0;
    };

    $scope.goToQuestion = function(index) {
    $scope.currentQuestion = $scope.currentQuiz.questions[index];
        $scope.currentIndex = index;
    }

    $scope.previousQuestion = function() {
        if($scope.currentIndex > 0)
        $scope.goToQuestion($scope.currentIndex - 1);
    }

    $scope.nextQuestion = function() {
        if($scope.currentIndex < $scope.currentQuiz.questions.length - 1)
            $scope.goToQuestion($scope.currentIndex + 1);
    }


    $scope.saveAnswers = function() {
       $http.post('/api/quizzes/results',$scope.currentQuiz)
           .success(function(data) {
               console.log('Success');
               console.log(data);
               $location.search('');
               $location.path('/');
           })
           .error(function(data) {
               console.log('Error');
               console.log(data);
           })
    }


    if($scope.quizID == null)
    {
        $scope.errorMessage = 'Select a quiz !';
        $scope.quizError = true;
    }
   else {
        $scope.currentQuiz = {};
        $http.get('/api/quizzes/'+$scope.quizID)
            .success(function(quiz) {
                console.log('Success');
                console.log(quiz);
                $scope.currentQuiz = quiz[0];
                $scope.init();
                $(".btn").mouseup(function(){
                    $(this).blur();
                });
            })
            .error(function(data){
               console.log('Error' + data);
            });
        }

    //remove the focus on buttons after clicking



}]);
/*
 * Created by Dimitar on 1/16/2016.
 */
quizGenerator.controller('userResultController',["$scope","$state","$http","$location",
    function($scope, $state, $http, $location){

        $scope.resultID = $location.search().resultID;
        $scope.errorMessage = 'Select a quiz !';
        $scope.currentQuiz = {};
        $scope.quizQuestions = [];
        $scope.currentIndex = 0;
        $scope.currentQuestion = {};


        $scope.saveScore = function() {
            var resultObject = {};
            resultObject.id = $scope.resultID;
            resultObject.points = $scope.user.currentScore;
            console.log('Result object:');
            console.log(resultObject);
           $http.post('/api/quizzes/results/points',resultObject)
               .success(function(data)
                {
                console.log('Success');
                    console.log(data);
                    $location.search('resultID',null);
                    $location.path('/viewResults');
                })
             .error(function(data)
               {
                console.log('Error');
                console.log(data);
               });
        };

        if($scope.resultID == null) {

            $scope.quizError = true;
        }
        else {
            $http.get('/api/quizzes/result/' + $scope.resultID)
                .success(function(data) {
                    if(data == 'Error')
                        $scope.quizError = true;

                    else {
                        console.log(data);
                        $scope.user = data[0].user;
                        $scope.currentQuiz = data[0].quiz;
                        $scope.quizQuestions = $scope.currentQuiz.questions;
                        $scope.currentQuestion = $scope.quizQuestions[0];
                        $scope.currentAnswers = $scope.currentQuestion.answers;

                        $(".btn").mouseup(function(){
                            $(this).blur();
                        })

                        $('#myModal').on('hidden.bs.modal', function () {
                            $("#sscore").blur();
                            console.log('HERE');
                        })
                    }

                })
                .error(function(data){
                    $scope.quizError = true;
                    console.log(data);
                })



            $scope.goToQuestion = function(index) {
                $scope.currentQuestion = $scope.currentQuiz.questions[index];
                $scope.currentIndex = index;
            }

            $scope.previousQuestion = function() {
                if($scope.currentIndex > 0)
                    $scope.goToQuestion($scope.currentIndex - 1);
            }

            $scope.nextQuestion = function() {
                if($scope.currentIndex < $scope.currentQuiz.questions.length - 1)
                    $scope.goToQuestion($scope.currentIndex + 1);
            }

            $scope.getColor = function(currentAnswer) {
            if(currentAnswer.type == 'radio' || currentAnswer.type == 'checkbox') {

                if (currentAnswer.selected == true && currentAnswer.is_correct == 1)
                    return '#20a046';

                else if (currentAnswer.selected == true && currentAnswer.is_correct != 1)
                    return '#ff3211';

                else if (currentAnswer.is_correct == 1)
                {
                    return '#d7d700';
                }
                else return '' ;
                }
            else if(currentAnswer.information == currentAnswer.selected) {
                return '#20a046';
                }

            else return '#ff3211';
            }




        }






    }]);

/**
 * Created by Dimitar on 1/30/2016.
 */

quizGenerator.controller('viewResultsController',["$scope","$state","$http","$location",'dateParser',
    function($scope, $state, $http, $location, dateParser){

        $scope.quizID = $location.search().quizID;
        $scope.displayedCollection = [];
        $scope.rowCollection = [];

        if($scope.quizID == null)
        {
            $scope.errorMessage = 'Select a quiz !';
            $scope.quizError = true;
        }
        else {
            $scope.currentQuiz = {};
            $http.get('/api/quizzes/results/'+$scope.quizID)
                .success(function(results) {

                    if(results == 'Error') {
                        $scope.errorMessage = 'Select a quiz !';
                        $scope.quizError = true;
                    }

                    else {
                        console.log(results);
                        $scope.currentQuiz = results[0].quiz;
                        var tableArray = [];
                        for(var i = 0; i < results.length; i++) {
                            tableArray.push(results[i].user);
                            tableArray[i].result_id = results[i].id;
                            tableArray[i].score = results[i].score;
                            tableArray[i].is_graded = results[i].is_graded;
                            tableArray[i].sent_at = dateParser.parseDates(results[i].created_at);
                        }

                        $scope.rowCollection = tableArray;
                        $scope.displayedCollection = [].concat(tableArray);

                        //$scope.rowCollection = results;
                        //$scope.displayedCollection = [].concat(results);
                        //console.log($scope.displayedCollection);
                        //$scope.predicates = ['name', 'email', 'sent_at', 'score'];

                    }
                })
                .error(function(data){
                    console.log('Error' + data);
                    $scope.errorMessage = 'Select a quiz !';
                    $scope.quizError = true;
                });
        }


        $scope.showResult = function(resultID) {
            $location.search('resultID',resultID);
            $location.path('/userResult')
        }

    }]);

/**
 * Created by Dimitar on 2/5/2016.
 */
quizGenerator.service('dateParser',function(){

    return {
        parseDates : function(date) {
            return date.split(' ')[0];
        }
    }

});