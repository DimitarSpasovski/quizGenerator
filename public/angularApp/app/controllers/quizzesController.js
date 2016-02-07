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