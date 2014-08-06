(function(){
	
	var module = angular.module('kod-controller',['ngRoute']);

	module.controller('AppController',['$scope','$routeParams', function($scope, $routeParams){
			$scope.authorize = function() {
				var client_id = 'be734b9e87474a4faaa56aab77d608b6';
				var redirect_uri = 'http://localhost:3000/';
				var scope = 'user-library-modify';

				var authorizeUrl = 'https://accounts.spotify.com/authorize';
				authorizeUrl = authorizeUrl + '?response_type=token';
				authorizeUrl = authorizeUrl + '&client_id=' + encodeURIComponent(client_id); 
				authorizeUrl = authorizeUrl + '&redirect_uri=' + encodeURIComponent(redirect_uri); 
				authorizeUrl = authorizeUrl + '&scope=' + encodeURIComponent(scope);

				window.location = authorizeUrl;
			}
		}
	]);

})();