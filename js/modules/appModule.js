var templates = "/../../templates";

angular.module('TestApp', ['ngRoute'])
.config(function ($routeProvider, $locationProvider) {
	'use strict';
	$locationProvider.html5Mode({
        enabled: true,
        requireBase: false
	});

	$routeProvider.when('/', { 
        //templateUrl: '../../index.html',
        //template: 'Main!!',
        //controller: 'mainController'
        redirectTo: '/auth'
    })
    .when('/auth', { 
        templateUrl: templates + '/auth.html',
        controller: 'authController'
    })
    .when('/albums', { 
        templateUrl: templates + '/albums.html',
        controller: 'albumsController'
    })
    .when('/photos', { 
        templateUrl: '/templates/photos.html',
        controller: 'photosController'
    })
    .otherwise({
        redirectTo: '/'
    });
})
.factory('AuthService', function($rootScope, $location) {
	// Профиль текущего пользователя
	var profile = {};
	// Статус авторизации
	var authStatus = false;
	return {
		getProfile: function() {
			return profile;
		},
		isAuthorize: function() {
			return authStatus;
		},
		checkAuth: function() {
			// VK.Auth.getLoginStatus(function(response){
			// 	if (response.session){
			// 		authStatus = true;
			// 		VK.Api.call('users.get', {
		 //                user_id: response.session.user.id,
		 //                fields: 'photo_200',
		 //                name_case: 'nom'
		 //            }, function(users){
		 //                profile = users.response[0];
		 //                $rootScope.$broadcast('profileStatusChanged');
		 //            }); 
			// 	}else{
			// 		$rootScope.$apply(function() {
			//             $location.path("/auth");
			//         });
			// 	}
			// });
		},
		authorize: function(user, callback) {
			profile = user;
			authStatus = true;
			if (callback instanceof Function){
				callback();
			}
		},
		logOut: function(callback) {
			profile = {};
			authStatus = false;
			if (callback instanceof Function){
				callback();
			}
		},
	};
})
.run(function($rootScope, $location, AuthService){
	var appId = 5366823;
    // Инициализация VK API
    VK.init({
        apiId: appId
    });

    VK.Auth.login(function(response){ 
    	if(response.status == 'connected') {
    		VK.Api.call('users.get', {
	            user_id: response.session.user.id,
	            fields: 'photo_200',
	            name_case: 'nom'
	        }, function(users){
	            AuthService.authorize(users.response[0]);
	            $rootScope.$broadcast('profileStatusChanged');
	            $rootScope.$apply(function() {
		            $location.path("/albums");
		        });
	        });   
    	}else {
    		$rootScope.$apply(function() {
	            $location.path("/auth");
	        });
    	}
           
    } , VK.access.PHOTOS);    	
});
