
require('../scss/home.scss');
require('angular');

var app = angular.module('PhotoBoothApp',[]),
	query = require('./queryParams')(document.location.search);

app.controller('main', ['$scope', '$location', '$http', function($scope, $location, $http) {
    $scope.photos = getPhotosJSON();
    $scope.view = 'gallery';
    $scope.currentPhotoName;

    if(query.p) {
    	$scope.view = 'single';
    	$scope.currentPhotoName = query.p;
    }

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

}]);
