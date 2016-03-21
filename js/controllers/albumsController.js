var testApp=angular.module('TestApp');
testApp.controller("albumsController",
    function ($scope, $location, AuthService, $timeout, $routeParams) {

    	//var id = $routeParams["id"];
    	//AuthService.checkAuth();
		
		$scope.profile = AuthService.getProfile();
	  	$scope.albums = [];

    	$scope.$on('profileStatusChanged', function(){
	        init();
	    });

	    init();

	    function init() {
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
                		$scope.albums[i].id = albums.response[i].aid;
                		$scope.albums[i].name = albums.response[i].title;
                		$scope.albums[i].size = albums.response[i].size;
                		// Получение фото размера 'r'
                		// $scope.albums[i].photo = albums.response[i].sizes.filter(function(size){
                		// 	return size.type == 'r';
                		// })[0].src;
                		$scope.albums[i].photo = albums.response[i].sizes[albums.response[i].sizes.length - 1].src;
                	}
                	//$scope.albums = albums.response;
                	$timeout(function() {
						$scope.$digest();
					});	
                }
            });  
            
            
	    }

	   	    
	    
	    // $scope.albums = [
	    // 	{ name: "album1", src:"http://vignette4.wikia.nocookie.net/logopedia/images/a/a6/Real-Madrid.png/revision/latest?cb=20120211170829" },
	    // 	{ name: "album2", src:"http://s25.postimg.org/vbep6kcgf/barcelona.png" },
	    // 	{ name: "album3", src:"http://sport.img.com.ua/nxs287/b/orig/7/71/7551367847e0a45e7d6a439f0a229717.png" },
	    // 	{ name: "album3", src:"https://upload.wikimedia.org/wikipedia/it/0/0d/Chelsea_FC.png" },
	    // 	{ name: "album1", src:"http://vignette4.wikia.nocookie.net/logopedia/images/a/a6/Real-Madrid.png/revision/latest?cb=20120211170829" },
	    // 	{ name: "album2", src:"http://s25.postimg.org/vbep6kcgf/barcelona.png" },
	    // 	{ name: "album3", src:"http://sport.img.com.ua/nxs287/b/orig/7/71/7551367847e0a45e7d6a439f0a229717.png" },
	    // 	{ name: "album3", src:"https://upload.wikimedia.org/wikipedia/it/0/0d/Chelsea_FC.png" },
	    // ];
});