var module = angular.module('spotifyController',['ngRoute']);

module.controller('spotifyController',['$scope','$routeParams', 'spotify-service', function($scope, $routeParams, spotifyService){
	spotifyService.setAccessToken(getJsonFromUrl($routeParams.token));
	function getJsonFromUrl(text) {
	  var data = text.split("&");
	  var result = {};
	  for(var i=0; i<data.length; i++) {
	    var item = data[i].split("=");
	    result[item[0]] = item[1];
	  }
	  return result;
	}

	setTimeout( function() {
		window.location = "http://king-of-discovery.herokuapp.com/";
	}, 100);	
}]);