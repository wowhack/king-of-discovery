(function(){
	
	var module = angular.module('searchbar-controller',[]);

	module.controller('searchbar-controller',['$scope', 'searchbar-service', function($scope, searchbarService){
			$scope.query = "";
			$scope.trackLimit = 3;
			$scope.tracks = [];

			$scope.search = function() {
				var promise = searchbarService.searchTracks($scope.query);

				var successCallback = function(response) {
					if($scope.tracks.length < 3) {
						var track = {};
						var artist = { name: "" };
						track.preview = [];

						track.preview.push(response.tracks.items[0].preview_url);
						artist.name = response.tracks.items[0].artists[0].name;

						getSimilarArtists(artist.name, track, artist);
					}
				}

				var errorCallback = function() {
					console.log("ERROR");
				}

				promise.then(successCallback, errorCallback);
			}

			var getSimilarArtists = function(name, track, artist) {
				var promise = searchbarService.getSimilarArtists(name);

				var successCallback = function(response) {
					track.artists = response.response.artists;
					track.artists.push(artist);

					$scope.tracks.push(track);
					console.log($scope.tracks);
				}

				var errorCallback = function() {
					console.log("ERROR");
				}

				promise.then(successCallback, errorCallback);
			}
		}
	]);

})();