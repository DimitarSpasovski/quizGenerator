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
