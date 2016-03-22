var templates = "/../../templates";

angular.module('TestApp', ['ngRoute'])
.config(function ($routeProvider, $locationProvider) {
	'use strict';
	$locationProvider.html5Mode({
        enabled: true,
        requireBase: false
	});

	$routeProvider.when('/', {
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
    .when('/album/:album_id', { 
        templateUrl: '/templates/photos.html',
        controller: 'photosController'
    })
    .otherwise({
        redirectTo: '/'
    });
})
.factory('AppService', function($rootScope, $location) {
	var title = "";
	return {
		getTitle: function() {
			return title;
		},
		setTitle: function(newTitle) {
			title = newTitle;
		},
		redirectTo: function(route, newTitle) {
			title = newTitle;
			$rootScope.$apply(function() {
	            $location.path(route);
	        });
		}
	}
})
.factory('AuthService', function($rootScope) {
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
.run(function($rootScope, $location, AuthService, AppService){
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
			            AppService.redirectTo('/albums');
			        }); 
				}else{
					AppService.redirectTo('/auth');
				}
			});
});
