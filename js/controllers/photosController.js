var testApp=angular.module('TestApp');
testApp.controller("photosController", ['$scope','$route', '$routeParams', '$location',
    function ($scope, $route, $routeParams, $location) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;

}]);