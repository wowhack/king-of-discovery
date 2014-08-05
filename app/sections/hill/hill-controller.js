(function(){
	
	var module = angular.module('hill-controller',['ngRoute']);

	module.controller('HillController', ['$routeParams','$scope', function($routeParams, $scope){
		$scope.genre = $routeParams.genre;
	}]);

})();