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
			VK.Auth.getLoginStatus(function(response){
				if (response.session){
					return true;
				}else{
					return false;
				}
			});
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
	// ID приложения в ВК
	var appId = 5366823;
    // Инициализация VK API
    VK.init({
        apiId: appId
    });
    // Проверка авторизации
    VK.Auth.getLoginStatus(function(response){
				if (response.session){
					authStatus = true;
					VK.Api.call('users.get', {
		                user_id: response.session.mid,
		                fields: 'photo_200',
		                name_case: 'nom'
		            }, function(users){
			            AuthService.authorize(users.response[0]);
			            $rootScope.$broadcast('profileStatusChanged');
			            $rootScope.$apply(function() {
				            $location.path("/albums");
				        });
			        }); 
				}else{
					$rootScope.$apply(function() {
			            $location.path("/auth");
			        });
				}
			}); 

    // Срабатывает после авторизации
    VK.Observer.subscribe('auth.login', function(response){
		console.log("auth");
	});
	// Событие изменения сессии
	VK.Observer.subscribe('auth.sessionChange', function(response){
		console.log("session changed");
		if (!AuthService.checkAuth()){
			$rootScope.$apply(function() {
	            $location.path("/auth");
	        });
		}
	});	
});
