var module = angular.module('searchbar-service',[]);

module.factory('searchbar-service', ['$q', '$http', function($q, $http) {
	return {
		searchTracks: function(query) {
			var deferred = $q.defer();

			$http.get('https://api.spotify.com/v1/search?q='+query+'&type=track').success(function(response) {
          		deferred.resolve(response);
        	});

        	return deferred.promise;
		}
	}
}]);