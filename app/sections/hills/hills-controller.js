(function(){
	
	var module = angular.module('hills-controller',['hill-socket-service']);

	module.controller('HillsController', ['hillSocket', function(hillSocket){
		hillSocket.emit('clear');
	}]);

})();