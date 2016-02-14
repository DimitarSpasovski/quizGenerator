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
