var testApp=angular.module('TestApp');
testApp.controller("mainController", function ($rootScope, $scope, $location, AuthService) {

    $scope.$on('profileStatusChanged', function(){
        //console.dir(AuthService.getProfile());
    });
});