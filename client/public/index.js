var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider',
    function routeProvider ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'templates/login.html',
                controller: 'UserController'
            })
            .when('/home', {
                templateUrl: 'templates/home.html',
                controller: 'homeController'
            })
            .when('/connect', {
                templateUrl: 'templates/connect.html',
                controller: 'connectController'
            })
            .otherwise({
                redirectTo:'/home'
            });
    }]);

app.service('UserService',  ['$http', 'socket', function($http, socket) {


    // on se sert de thus pour garder le this du service
    var thus = this;

    this.onelist = [];
    this.list = [];
    // logged est un objet
    this.logged = {};
    this.error = '';

    this.GetAll = function(){
        $http.get('/users')
            .success(function(data) {
                thus.list = data;
            })
            .error(function(data) {
                thus.error = data;
            });
    };

    this.Create = function(newUser) {
        $http.post('/users', newUser)
            .error(function(data) {
                thus.error = data;
            });
    };

    this.GetOne = function(id) {
      $http.get('/users/'+id)
          .success(function (user) {
              thus.onelist = user;
          })
          .error(function(data) {
              thus.error = data;
          })
    };

    this.Clear = function(id) {
      $http.delete('/users/'+id)
          .success(function() {
              thus.GetAll();
          })
          .error(function (user) {
              thus.error = user;
          })
    };

    this.logged = function () {
      $http.get('/users/connect')
          .success(function (user) {
              thus.logged = user;
          })
    };

    this.login = function (blob) {
        $http.post('/users/connect', blob)
            .success(function (user) {
                thus.logged = user;
            })
            .error(function (user) {
                thus.error = user;
            })
    };

    socket.on('newUser', function(data) {
        thus.list.push(data);
    });



    this.GetAll();
    this.logged();


}]);

app.controller('UserController', ['$scope', 'UserService', 'socket', function($scope, UserService, socket) {
    $scope.newUser = {
        login: '',
        password: ''
    };

    $scope.finder = {
        id: ''
    };

    $scope.UserService = UserService;
}]);
