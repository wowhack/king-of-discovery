(function(){
	
	var module = angular.module('searchbar-controller',[]);

	module.controller('searchbar-controller',['$scope', 'searchbar-service', function($scope, searchbarService){
			$scope.query = "";
			$scope.trackLimit = 3;
			$scope.tracks = [];
			$scope.artists = [];

			var artist = { name: "" };

			$scope.search = function() {
				var promise = searchbarService.searchTracks($scope.query);

				var successCallback = function(response) {
					if($scope.tracks.length < 3) {
						$scope.tracks.push(response.tracks.items[0].preview_url);
						artist.name = response.tracks.items[0].artists[0].name;

						getSimilarArtists(artist.name);
						console.log($scope.tracks);
					}
				}

				var errorCallback = function() {
					console.log("ERROR");
				}

				promise.then(successCallback, errorCallback);
			}

			var getSimilarArtists = function(name) {
				var promise = searchbarService.getSimilarArtists(name);

				var successCallback = function(response) {
					$scope.artists = response.response.artists;
					$scope.artists.push(artist);
				}

				var errorCallback = function() {
					console.log("ERROR");
				}

				promise.then(successCallback, errorCallback);
			}
		}
	]);

})();