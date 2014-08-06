var module = angular.module('spotify-service',[]);

module.factory('spotify-service', ['$q', '$http', function($q, $http) {
	return {
		setAccessToken: function(token) {
			localStorage.setItem('accessToken', token.access_token);
		},

		getAccessToken: function() {
			return localStorage.getItem('accessToken', '');
		},

		getUserName: function(token) {
			var deferred = $q.defer();

			$http.get('https://api.spotify.com/v1/me', {
				headers: {
					'Authorization': 'Bearer ' + token
				}
			}).success(function(response) {
          		deferred.resolve(response);
        	}).error(function(error) {
        		deferred.reject(error);
        	});

        	return deferred.promise;
		}


	};
}]);