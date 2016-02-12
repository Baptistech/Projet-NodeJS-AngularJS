/**
 * Created by baptiste on 10/12/2015.
 */


app.controller('connectController', ['$scope', 'UserService', function($scope, UserService) {
    $scope.connect = 'You will be connect';
    $scope.UserService = UserService;

    $scope.connectUser = {
        login: '',
        password: ''
    };

}]);