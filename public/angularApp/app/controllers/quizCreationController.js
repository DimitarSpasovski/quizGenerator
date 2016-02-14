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
