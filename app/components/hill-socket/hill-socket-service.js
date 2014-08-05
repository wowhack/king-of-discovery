(function(){
	
	var module = angular.module('hill-socket-service',['btford.socket-io']);

	module.factory('hill-socket', ['socketFactory', function(socketFactory){
		var socket = socketFactory();
		socket.forward('youAreTheKingOfDiscovery');
		socket.forward('newMessage');
		socket.forward('joinedRoom');
		return socket;
	}])

})();