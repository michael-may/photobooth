
require('../scss/home.scss');
require('angular');
require('../bower_components/ng-simplePagination/simplePagination.js');
//require('../bower_components/angular-utf8-base64/angular-utf8-base64.js');
//require('../bower_components/angular-base64/angular-base64.js');

var app = angular.module('PhotoBoothApp',['simplePagination']),
	query = require('./queryParams')(document.location.search);

// ONly need if we're sharing our website through social media
/*app.config(function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!')
});*/

app.controller('main', ['$scope', '$location', '$http', 'Pagination', 
    function($scope, $location, $http, Pagination) {

	$scope.backButton = backButton;
    $scope.clickPhoto = clickPhoto;
    $scope.emailFiles = emailFiles;
    $scope.email = '';
    $scope.currentPhotoName;
    $scope.photos = getPhotosJSON();
    $scope.view = 'gallery';
    $scope.showBackButton = true;
    $scope.pagination = Pagination.getNew(9);
    $scope.pagination.numPages = 1;
    $scope.isGifCollapsed = true;
    $scope.isShareCollapsed = true;
    $scope.isVideoCollapsed = true;
    $scope.isEmailCollapsed = true;

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

    function emailFiles(name, email) {

            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://s3.amazonaws.com/shoptology-photo-booth/'+name+'.mp4', true);
            xhr.responseType = 'arraybuffer';
             
            xhr.onload = function(e) {
              if (this.status == 200) {
                // get binary data as a response
                var blob = new Uint8Array(this.response); 
                console.log('Got Blob', blob);

                // Send Email
                function Uint8ToString(u8a){
                  var CHUNK_SZ = 0x8000;
                  var c = [];
                  for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
                    c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
                  }
                  return c.join("");
                }
                var file = btoa(Uint8ToString(blob));
                //var file = base64.encode(blob);

                console.log('Sending email');

                $http.post(
                    'https://mandrillapp.com/api/1.0/messages/send.json',
                    {
                        key: 'eFx6Arc4lLspc5HmPmwvxQ',
                        'message': {
                            'from_email': 'no-reply@goshoptology.com',
                            'from_name': 'Shoptology',
                            'headers': {
                                'Reply-To': 'no-reply@goshoptology.com'
                            },
                            'subject': 'Here are your gifs from Block Street Party',
                            'important': true,
                            'html': '<html>Here are your images from Block Street Party, thanks for visiting! - The Shoptology Team<\/html>',
                            'to': [
                                {
                                    'email': email,
                                    'type': 'to'
                                }
                            ],
                            'attachments': [
                                {
                                    'type': 'video/mp4',
                                    'name': $scope.currentPhotoName+'.mp4',
                                    'content': file
                                }
                            ]
                        }
                    }
                )
                .then(function(result) {
                    console.log('email sent')
                    
                }, function(error) {
                    console.log('error', error);
                    $scope.errors = ['There was an error contacting the server, please try again and contact us if you continue to have issues.'];
                });

              }else{
                console.log('error', error);
                $scope.errors = ['There was an error contacting the server, please try again and contact us if you continue to have issues.'];
              }
            };
             
            xhr.send();
    }


}]);
