(function(){
	var lib_dependencies = ['ngRoute',
							'ngStorage'],
							
	    src_dependencies = ['kod-controller'];

	var app = angular.module('kod',lib_dependencies.concat(src_dependencies));

	app.config([
		'$routeProvider',
		function($routeProvider){
			$routeProvider.

			when('/', {
				templateUrl: '/sections/hills/hills.html'
			}).

			when('/about', {
				templateUrl: '/sections/about/about.html'
			}).

		    otherwise({
		        redirectTo: '/'
		    });
	}]);

	// Bind all click events of <a> tags so that when clicked 
	// inmediatly loose focus and don't stay with grey dots
	// around them.
	$(document).on("click","a, button",function(){
		this.blur();
	});


})();