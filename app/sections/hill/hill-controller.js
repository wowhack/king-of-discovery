(function(){
	
	var module = angular.module('hill-controller',['ngRoute','hill-socket-service']);

	module.controller('HillController', ['$routeParams','$scope','hillSocket', function($routeParams, $scope, hillSocket){
		$scope.genre = $routeParams.genre;
		$scope.isKing = false;
		hillSocket.on('youAreTheKingOfDiscovery', function(ev, data){
			$scope.isKing = true;
		});

		hillSocket.emit('joinRoom',{joinRoom: $scope.genre});

	}]);

})();