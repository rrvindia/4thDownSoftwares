var mainModule = angular.module('BIOComponent', ['ngRoute', 'ngDialog']);
mainModule.config(function ($routeProvider) {
    $routeProvider.when('/', {
        redirectTo: '/home'
    })
    .when('/home', {
        templateUrl: 'partials/home.html'
    })
    .when('/userdetails', {
        templateUrl: 'partials/userdetails.html',
        controller: 'UserCtrl', 
        controllerAs: 'userCtrl'
    })
    .otherwise({
        redirectTo: '/home'
    });
});