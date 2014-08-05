(function(){
	
	var module = angular.module('searchbar-controller',[]);

	module.controller('searchbar-controller',['$scope', 'searchbar-service', 'hillSocket', function($scope, searchbarService, hillSocket){
			$scope.query = "";
			$scope.tracks = [];
			$scope.trackName = "";

			var index = 0;

			$scope.search = function() {
				var promise = searchbarService.searchTracks($scope.query);

				var successCallback = function(response) {
					if($scope.tracks.length < 3) {
						var track = {};
						var artist = { name: "", correct: true };
						track.preview = [];
						track.uri = [];
						track.index = index;
						index++;
						$scope.query = "";
						$scope.trackName = response.tracks.items[0].name;

						track.preview.push(response.tracks.items[0].preview_url);
						var splitUri = response.tracks.items[0].uri.split(":");
						track.uri.push(splitUri[2]);
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
					var swap = {};
					var number = 0;

					track.artists = response.response.artists;
					track.artists.push(artist);
					swap = track.artists[3];
					number = Math.floor((Math.random() * 3) + 1);
					track.artists[3] = track.artists[number];
					track.artists[number] = swap;

					$scope.tracks.push(track);
					console.log($scope.tracks);
				}

				var errorCallback = function() {
					console.log("ERROR");
				}

				promise.then(successCallback, errorCallback);
			}

			$scope.submitTracks = function() {
				hillSocket.emit('suggestTracks',{tracks: $scope.tracks});
			}

			$scope.guess = function(index, name) {
				hillSocket.emit('guess',{ index: index, artist: name });
			}

			hillSocket.on('tracksHaveBeenSuggested', function(ev, data){
				var i = 0;
				$scope.tracks = ev.tracks;
				
				play(i);
			});

			var play = function(i) {
				var player = document.getElementById(i);
				player.play();

				player.addEventListener('ended', function() {
					i++;
					play(i);
				});
			}

			$scope.addToPlaylist = function(uri) {

			}
		}
	]);

})();