(function(){
	
	var module = angular.module('kod-controller',[]);

	module.controller('AppController',['$scope', function($scope){
			$scope.hello = "hello";
		}
	]);

})();