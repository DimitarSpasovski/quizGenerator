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
