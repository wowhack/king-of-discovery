var module = angular.module('spotifyController',['ngRoute']);

module.controller('spotifyController',['$scope','$routeParams', function($scope, $routeParams){
	console.log("Hello");
	console.log($routeParams.token);
}]);