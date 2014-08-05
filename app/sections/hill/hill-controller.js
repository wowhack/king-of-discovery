(function(){
	
	var module = angular.module('hill-controller',['ngRoute','hill-socket-service']);

	module.controller('HillController', ['$routeParams','$scope','hill-socket', function($routeParams, $scope, HillSocket){
		$scope.genre = $routeParams.genre;
		$scope.isKing = false;
		$scope.$on('socket:youAreTheKingOfDiscovery', function(ev, data){
			$scope.isKing = true;
		});

		$scope.joinRoom = function(){
			HillSocket.emit('joinRoom',{joinRoom: $scope.genre});
		}
	}]);

})();