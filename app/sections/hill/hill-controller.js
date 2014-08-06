(function(){
	
	var module = angular.module('hill-controller',['ngRoute','hill-socket-service','guy-directive']);

	module.controller('HillController', ['$routeParams','$scope','hillSocket', function($routeParams, $scope, hillSocket){
		$scope.genre = $routeParams.genre;
		$scope.isKing = false;
		$scope.wait = true;
		hillSocket.on('youAreTheKingOfDiscovery', function(ev, data){
			$scope.isKing = true;
			$scope.wait = false;
		});

		hillSocket.emit('joinRoom',{joinRoom: $scope.genre});

		$scope.messages = [];

		hillSocket.on('newMessage', function(data){
			addMessage(data);
		});

		$scope.newMessage = "";

		function addMessage(msg){
			$scope.messages.push(msg);
			$('.message-list').animate({ scrollTop: $('.message-list')[0].scrollHeight}, 200);
		}

		$scope.sendMessage = function(){
			hillSocket.emit('newMessage',{message: $scope.newMessage});
			addMessage({username: 'me', message: $scope.newMessage, me: true});
			$scope.newMessage = "";
			return false;
		}

	}]);

})();