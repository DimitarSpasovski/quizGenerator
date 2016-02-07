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