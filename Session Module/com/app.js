// Create module object for defining controllers, directives configs, factories, services and filters 
var mainModule = angular.module('BIOComponent', ['ngDialog','ngRoute','ngTouch']);

//defining config for routes
mainModule.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
    })
    .otherwise({
        redirectTo: '/index.html'
    });
});