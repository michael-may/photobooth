
require('../scss/home.scss');
require('angular');

var app = angular.module('PhotoBoothApp',[]),
	query = require('./queryParams')(document.location.search);

app.controller('main', ['$scope', '$location', '$http', function($scope, $location, $http) {
    
	$scope.backButton = backButton;
    $scope.clickPhoto = clickPhoto;
    $scope.currentPhotoName;
    $scope.photos = getPhotosJSON();
    $scope.view = 'gallery';
    $scope.showBackButton = true;

    

    $scope.$on('$locationChangeStart', function(event, route) {
    	if(query.p) {
	    	$scope.view = 'single';
	    	$scope.currentPhotoName = query.p;
	    	$scope.showBackButton = false;
	    	return false;
	    }

    	if(($location.path() == '/' && query.p) || $location.path() == '/single') {
    		$scope.view = 'single';

    		if(query.p) {
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
        }, function(error) {
            console.log(error);
            $scope.errors = ['There was an error contacting the server, please try again and contact us if you continue to have issues.'];
        });
    }

    function clickPhoto(photo) {
    	$scope.currentPhotoName = photo.name;
    	$location.path('/single');
    }

    function backButton() {
    	$location.path('/');
    }

}]);
