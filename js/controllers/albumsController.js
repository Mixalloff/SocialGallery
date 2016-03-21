var testApp=angular.module('TestApp');
testApp.controller("albumsController",
    function ($scope, $location, AuthService, AppService, $timeout, $routeParams) {

    	//var id = $routeParams["id"];
    	//AuthService.checkAuth();
		
		$scope.profile = AuthService.getProfile();
	  	$scope.albums = [];

    	$scope.$on('profileStatusChanged', function(){
	        initializePage();
	    });

	    initializePage();

	    function initializePage() {
	    	$scope.profile = AuthService.getProfile();

	    	VK.Api.call('photos.getAlbums', {
                owner_id: $scope.profile.uid,
                need_system: 1,
                need_covers: 1,
                photo_sizes:1
            }, function(albums){
                if (albums.response){
                	for (var i = 0; i < albums.response.length; i++){
                		$scope.albums[i] = {};
                		// Установка ID альбома (если системный - спец значение)
            			switch(albums.response[i].aid){
            				case -6: { $scope.albums[i].id = "profile"; break; }
            				case -7: { $scope.albums[i].id = "wall"; break; }
            				case -15: { $scope.albums[i].id = "saved"; break; }
            				default: { $scope.albums[i].id = albums.response[i].aid; }
            			}
                		
                		$scope.albums[i].name = albums.response[i].title;
                		// Количество фото в альбоме
                		$scope.albums[i].size = albums.response[i].size;
                		// Получение фото максимального размера
                		$scope.albums[i].photo = albums.response[i].sizes[albums.response[i].sizes.length - 1].src;
                	}
                	$timeout(function() {
						$scope.$digest();
					});	
                }
            });  
	    }

	    $scope.openAlbum = function (album) {
	    	var title = "Альбом > " + album.name;
	    	$timeout(function() {
	    		AppService.redirectTo("/album/" + album.id, title);
			});	
	    	
	    // console.log(album_id);
	    }
});