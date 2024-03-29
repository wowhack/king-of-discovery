(function(){
	var lib_dependencies = ['ngRoute',
							'ngStorage'],
							
	    src_dependencies = ['kod-controller',
	    					'searchbar-controller',
	    					'searchbar-service',
	    					'hill-thumbnail-directive',
	    					'hill-controller',
	    					'spotifyController',
	    					'spotify-service',
	    					'hills-controller'
	    					];

	var app = angular.module('kod',lib_dependencies.concat(src_dependencies));

	app.config([
		'$routeProvider', '$sceDelegateProvider',
		function($routeProvider, $sceDelegateProvider){
			$routeProvider.

			when('/', {
				templateUrl: '/sections/hills/hills.html',
				controller: 'HillsController'
			}).

			when('/about', {
				templateUrl: '/sections/about/about.html'
			}).

			when('/hill/:genre',{
				templateUrl: '/sections/hill/hill.html',
				controller: 'HillController'
			}).
			when('/callback', {
				templateUrl: '/sections/hills/hills.html',
				controller: 'searchbar-controller'
			}).

			when('/:token', {
				controller: 'spotifyController',
				template: 'Loading...'
			});

		    /*otherwise({
		        redirectTo: '/'
		    });*/

		    $sceDelegateProvider.resourceUrlWhitelist([
     			'self',
     			'https://p.scdn.co/mp3-preview/**'
   			]);
	}]);

	// Bind all click events of <a> tags so that when clicked 
	// inmediatly loose focus and don't stay with grey dots
	// around them.
	$(document).on("click","a, button",function(){
		this.blur();
	});


})();