(function(){
	
	var module = angular.module('hill-thumbnail-directive',[]);

	module.directive('hillThumbnail', function(){
		return {
			restrict: 'E',
			templateUrl: '/components/hill-thumbnail/hill-thumbnail.html',
			replace: true,
			scope: true,
			link: function(scope, elm, attrs) {
				var genre = attrs['genre'];
				scope.background_src = '/resources/images/genres/' + genre + '.jpg';
			}
		};
	});

})();