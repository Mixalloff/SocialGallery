var testApp=angular.module('TestApp');
testApp.controller("authController", function ($rootScope, $scope, $location, $http, $timeout, AppService, AuthService) {
    $scope.AuthService = AuthService;
    if(AuthService.checkAuth()){
        AppService.redirectTo('/albums');
    }

    // Переход в альбомы при успешной авторизации
    $scope.goToAlbums = function(){
        AppService.redirectTo("/albums");
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
                            AppService.redirectTo("/albums");
                        });
                    });   
             }else {
                $timeout(function() {
                     AppService.redirectTo("/auth");
                });
                alert("Error auth!");
             }
        } , VK.access.PHOTOS); 
        
    });
});