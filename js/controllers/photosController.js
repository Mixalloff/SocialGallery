var testApp=angular.module('TestApp');
testApp.controller("photosController", function ($scope, $location, AuthService, AppService, $timeout, $routeParams) {
    
    $scope.$on("$routeChangeSuccess", function () {
        initializePage();
    });
    $scope.$on('profileStatusChanged', function(){
        initializePage();
    });

    $scope.album_id = $routeParams["album_id"];

    $scope.pageTitle = AppService.getTitle();
    $scope.profile = AuthService.getProfile();
  	$scope.photos = [];
  	$scope.popupImageSrc = "";
    $scope.isPopup = false;

    function initializePage() {
    	if ($scope.album_id !== undefined){
    		$scope.profile = AuthService.getProfile();

	    	VK.Api.call('photos.get', {
	            owner_id: $scope.profile.uid,
	            album_id: $scope.album_id,
	            extended: 1,
	            photo_sizes: 1
	        }, function(photos){
	        	console.dir(photos);
	            if (photos.response){
	            	for (var i = 0; i < photos.response.length; i++){
	            		$scope.photos[i] = {};
	            		$scope.photos[i].id = photos.response[i].pid;
	            		// Количество лайков
	            		$scope.photos[i].likes = photos.response[i].likes.count;
	            		// Получение фото максимального размера
	            		$scope.photos[i].src = photos.response[i].sizes[photos.response[i].sizes.length - 1].src;
	            	}
	            	$timeout(function() {
						$scope.$digest();
					});	
	            }
	        }); 
    	} else {
    		$scope.goToAlbums();
    	} 	 
    }

    $scope.goToAlbums = function() {
		AppService.redirectTo('/albums');
    }

    $scope.openPopupImage = function(item) {
    	$scope.popupImageSrc = item.photo.src;
    	$scope.isPopup = true;
    }

    $scope.closePopupImage = function() {
    	$scope.isPopup = false;
    }

});