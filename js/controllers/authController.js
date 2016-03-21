var testApp=angular.module('TestApp');
testApp.controller("authController", function ($rootScope, $scope, $location, $http, $timeout, AuthService) {
    $scope.AuthService = AuthService;
//AuthService.checkAuth();
    // Переход в альбомы при успешной авторизации
    $scope.goToAlbums = function(){
        $scope.$apply(function() {
            $location.path("/albums");
        });
    }
    // Авторизация
    $(".auth_btn").click(function(){
        VK.Auth.login(function(response){ 
            if(response.status == 'connected') {
                 VK.Api.call('users.get', {
                        user_id: response.session.user.id,
                        fields: 'photo_200',
                        name_case: 'nom'
                    }, function(users){
                        AuthService.authorize(users.response[0]);
                        $rootScope.$broadcast('profileStatusChanged');
                        $timeout(function() {
                            $rootScope.$apply(function() {
                                $location.path("/albums");
                            });
                        });
                    });   
             }else {
                $timeout(function() {
                     $rootScope.$apply(function() {
                            $location.path("/auth");
                        });
                });
                alert("Error auth!");
             }
        } , VK.access.PHOTOS); 
        
    });
});