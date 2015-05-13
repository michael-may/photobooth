
require('../scss/home.scss');
require('angular');
require('../bower_components/ng-simplePagination/simplePagination.js');

var app = angular.module('PhotoBoothApp',['simplePagination']),
	query = require('./queryParams')(document.location.search);

// ONly need if we're sharing our website through social media
/*app.config(function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!')
});*/

app.controller('main', ['$scope', '$location', '$http', 'Pagination', function($scope, $location, $http, Pagination) {

	$scope.backButton = backButton;
    $scope.clickPhoto = clickPhoto;
    $scope.currentPhotoName;
    $scope.photos = getPhotosJSON();
    $scope.view = 'gallery';
    $scope.showBackButton = true;
    $scope.pagination = Pagination.getNew(10);
    $scope.pagination.numPages = 1;
    $scope.isGifCollapsed = true;
    $scope.isShareCollapsed = true;

    $scope.$on('$locationChangeStart', function(event, route) {
    	if(query.p) {
	    	$scope.view = 'single';
	    	$scope.currentPhotoName = query.p;
	    	$scope.showBackButton = false;
	    	return false;
	    }

        var path_array = $location.path().split('/');
        console.log('path', path_array);

    	if(($location.path() == '/' && query.p) || path_array[1] == 'single') {
    		$scope.view = 'single';

            if(path_array[2]) {
                $scope.currentPhotoName = path_array[2];
            }else if(query.p) {
		    	$scope.currentPhotoName = query.p;
		    	$scope.showBackButton = false;
		    }

    	}else{
    		$scope.view = 'gallery';
    	}
    });

    function getPhotosJSON() {
    	$http({
            url: '/photos.json',
            method: 'GET'
        })
        .then(function(result) {
        	console.log(result.data);
            $scope.photos = result.data.photos;
            $scope.pagination.numPages = Math.ceil($scope.photos.length/$scope.pagination.perPage);
        }, function(error) {
            console.log(error);
            $scope.errors = ['There was an error contacting the server, please try again and contact us if you continue to have issues.'];
        });
    }

    function clickPhoto(photo) {
        console.log('Clicking Photo')
    	$scope.currentPhotoName = photo.name;
    	$location.path('/single/'+photo.name);
    }

    function backButton() {
    	$location.path('/');
    }

}]);
