(function(){
	
	var module = angular.module('searchbar-controller',[]);

	module.controller('searchbar-controller',['$scope', 'searchbar-service', 'hillSocket', 'spotify-service', function($scope, searchbarService, hillSocket, spotifyService){
			$scope.query = "";
			$scope.tracks = [];
			$scope.trackName = "";
			$scope.answered = [false,false,false,false];
			$scope.answer = {};

			var index = 0;

			$scope.search = function() {
				var promise = searchbarService.searchTracks($scope.query);

				var successCallback = function(response) {
					if($scope.tracks.length < 3) {
						$scope.query = "";
						$scope.chooseTrack = response.tracks.items;
						$scope.chooseTrack.push({ name: "Choose a track" });
						var swap = $scope.chooseTrack[$scope.chooseTrack.length - 1];
						$scope.chooseTrack[$scope.chooseTrack.length - 1] = $scope.chooseTrack[0];
						$scope.chooseTrack[0] = swap;
						$scope.trackChoosen = $scope.chooseTrack[0];
					}
				}

				$scope.removeTrack = function(index) {
					$scope.tracks.splice(index,1);
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
                    console.log(track.artists);
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
				if ($scope.tracks.length != 3){
					return;
				}
				hillSocket.emit('suggestTracks',{tracks: $scope.tracks});
				$scope.$parent.isKing = false;
				$scope.$parent.wait = true;
			}

			$scope.guess = function(index, name, i) {
				var guess = { index: index, artist: name };
				hillSocket.emit('guess',{ votes : guess });
				answered[index] = true;
				answer[index] = i;
			}

			hillSocket.on('tracksHaveBeenSuggested', function(ev, data){
				$scope.$parent.wait = false;
				var i = 0;
				$scope.tracks = ev.tracks;
				$scope.$parent.answers = null;
				$scope.answered = [false,false,false,false];
				$scope.answer = {};
				setTimeout(function(){
					play(i);	
				}, 100);
			});

			hillSocket.on('youAreTheKingOfDiscovery', function(ev, data){
				$scope.tracks = [];
				$scope.answered = [false,false,false,false];
				$scope.answer = {};
			});

			var play = function(i) {
				if(i <= 2) {
					var player = document.getElementById(i);
					player.play();

					player.addEventListener('ended', function() {
						i++;
						play(i);
					});
				}
			}

			$scope.addToPlaylist = function(uri) {
				searchbarService.addToPlaylist(uri);
			}

			$scope.setChoosenTrack = function() {
				var track = {};
				var artist = { name: "", correct: true };
				track.preview = [];
				track.uri = [];
				track.index = index;
				index++;

				track.name = $scope.trackChoosen.name;
				track.artist = $scope.trackChoosen.artists[0].name; 
				$scope.trackName = $scope.trackChoosen.name;

				track.preview.push($scope.trackChoosen.preview_url);
				var splitUri = $scope.trackChoosen.uri.split(":");
				track.uri.push(splitUri[2]);
				artist.name = $scope.trackChoosen.artists[0].name;

				getSimilarArtists(artist.name, track, artist);
			}
		}
	]);

})();