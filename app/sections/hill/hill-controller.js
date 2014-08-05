(function(){
	
	var module = angular.module('hill-controller',['ngRoute','hill-socket-service']);

	module.controller('HillController', ['$routeParams','$scope','hillSocket', function($routeParams, $scope, hillSocket){
		$scope.genre = $routeParams.genre;
		$scope.isKing = false;
		hillSocket.on('youAreTheKingOfDiscovery', function(ev, data){
			$scope.isKing = true;
		});

		hillSocket.emit('joinRoom',{joinRoom: $scope.genre});

		$scope.messages = [];

		hillSocket.on('newMessage', function(data){
			$scope.messages.push(data.message);
		});

		$scope.newMessage = "";

		$scope.sendMessage = function(){
			hillSocket.emit('newMessage',{message: $scope.newMessage});
			$scope.messages.push($scope.newMessage);
			$scope.newMessage = "";
		}

	}]);

})();