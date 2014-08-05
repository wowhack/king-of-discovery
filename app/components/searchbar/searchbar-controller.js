(function(){
	
	var module = angular.module('searchbar-controller',[]);

	module.controller('searchbar-controller',['$scope', 'searchbar-service', function($scope, searchbarService){
			$scope.query = "";
			$scope.trackLimit = 3;
			$scope.tracks = [];

			$scope.search = function() {
				console.log("Seaching for ", $scope.query);
				var promise = searchbarService.searchTracks($scope.query);

				var successCallback = function(response) {
					if($scope.tracks.length < 3) {
						$scope.tracks.push(response.tracks.items[0].preview_url);
						console.log($scope.tracks);
					}
				}

				var errorCallback = function() {
					console.log("ERROR");
				}

				promise.then(successCallback, errorCallback);
			}
		}
	]);

})();