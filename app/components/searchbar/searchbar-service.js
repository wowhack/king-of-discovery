var module = angular.module('searchbar-service',[]);

module.factory('searchbar-service', ['$q', '$http', 'spotify-service', function($q, $http, spotifyService) {
	return {
		searchTracks: function(query) {
			var deferred = $q.defer();

			$http.get('https://api.spotify.com/v1/search?q='+query+'&type=track').success(function(response) {
          		deferred.resolve(response);
        	}).error(function(error) {
        		deferred.reject(error);
        	});

        	return deferred.promise;
		},

		getSimilarArtists: function(name) {
			var deferred = $q.defer();

			$http.jsonp('http://developer.echonest.com/api/v4/artist/similar?api_key=BQMYVZPSG9FDJTT7N&format=jsonp&results=3&name=' + name + '&callback=JSON_CALLBACK').success(function(response) {
          		deferred.resolve(response);
        	}).error(function(error) {
        		deferred.reject(error);
        	});

        	return deferred.promise;
		},

		addToPlaylist: function(uri, token) { 
			$http.put('https://api.spotify.com/v1/me/tracks?ids=' + encodeURIComponent(uri), {}, {
				headers: {
					'Authorization': 'Bearer ' + spotifyService.getAccessToken()
				}
			}).success(function(response) {
          		console.log("Added track to Your Music");
        	}).error(function(error) {
        		console.log("ERROR");
        	});;
		}
	}
}]);