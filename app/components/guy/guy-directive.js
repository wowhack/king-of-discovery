var backgrounda = [
'<?xml version="1.0"?><svg width="150" height="320" xmlns="http://www.w3.org/2000/svg"><!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ --><g><title>Layer 1</title>  <path id="svg_1" d="m416,455.450012" opacity="0.5" stroke-width="1.5" stroke="#000000" fill="',
'"/></g><g><title>background</title><g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid"><rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/></g><path id="svg_2" d="m16,307.450165l119,-2.866302c-8,-89.55603 -30,-238.133728 -63,-238.133728c-33,0 -32,77.857025 -56,241.000031z" stroke-width="1.5" stroke="#000000" fill="',
'"/><ellipse ry="40.5" rx="40.999998" id="svg_3" cy="49.95031" cx="69.000003" fill-opacity="null" stroke-opacity="null" stroke-width="1.5" stroke="#000000" fill="',
'"/></g></svg>'

];

(function(){

	function random(base,top) {
		return base + Math.floor((Math.random()*(top-base)));
	}
	
	var module = angular.module('guy-directive',[]);

	module.directive('guy', [function(){
		
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			scope: {
				me: '=',
				king: '='
			}, // {} = isolate, true = child, false/undefined = no change
			controller: function($scope, $element, $attrs, $transclude) {
				$scope.left = random(-590,-370);
				if (Math.random() > 0.5){
					$scope.left = -$scope.left - 30;
				}
				$scope.bottom = random(8,12);
				$scope.adel = random(0,1000);

				var color = '#fff';
				$scope.zindex = 30;
				if ($scope.me){
					$scope.zindex = 40;
					color = '#4DCFDB';
				}

				var background = backgrounda.join(color);
				var greenback = "url('data:image/svg+xml;base64," + window.btoa(backgrounda.join('#9ED166')) + "')";
				var normalback = "url('data:image/svg+xml;base64," + window.btoa(background) + "')"; 

			$scope.background = normalback;
			$scope.$watch('king',function(){
				if ($scope.king) {
					$scope.background = greenback;
				} else {
					$scope.background = normalback;
				}
			});


			},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			   restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			   templateUrl: 'components/guy/guy.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				
			}
		};
	}]);

})();