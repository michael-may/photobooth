
require('../scss/reset.scss');
require('angular');

var app = angular.module('activateApp',[]),
    query = require('./queryParams')(document.location.search);

// ok

app.controller('activate', ['$scope', '$location', '$http', function($scope, $location, $http) {
    $scope.view = null;
    $scope.reset = {
        email: null,
        errors: []
    };
    $scope.set = {
        email: null,
        firstName: null,
        lastName: null,
        password: null,
        confirm: null,
        errors: []
    };

    function checkHash() {
        // Call Server to make sure hash is still valid
        $http({
            url: 'http://api.seasonlink.co/v1/users/activate',
            method: 'GET',
            params: {
                hash: query.hash
            }
        })
        .then(function(result) {
            if (result.data && result.data.meta.code === 200) {
                var user = result.data.response;
                $scope.set.email = user.email;
                $scope.set.firstName = user.firstName;
                $scope.set.lastName = user.lastName;
                $scope.view = 'set';
            } else {
                // Error
                $scope.view = 'check-error';
            }
        }, function(error) {
            console.log(error);
            $scope.reset.errors = ['There was an error contacting the server, please try again and contact us if you continue to have issues.'];
        });
        // Set view on success
    }

    if (query.hash) {
        // Check for a valid hash
        checkHash();
    } else {
        // Reset Password
        $scope.view = 'check-error';
    }


    $scope.activateAccount = function() {
        if ($scope.set.password !== $scope.set.confirm) {
            $scope.set.errors = ['Your passwords do not match.'];
            return false;
        }

        if (!$scope.set.firstName || !$scope.set.lastName || !$scope.set.email) {
            $scope.set.errors = ['Please make sure there are no blank fields.'];
            return false;
        }

        // Call server with updated password
        $http.post(
            'http://api.seasonlink.co/v1/users/activate',
            {
                email: $scope.set.email,
                firstName: $scope.set.firstName,
                lastName: $scope.set.lastName,
                hash: query.hash,
                password: $scope.set.password
            }
        ).then(function(result) {
            if (result.data && result.data.meta.code === 200) {
                $scope.roles = result.data.response.roles;
                $scope.view = 'set-success';
            } else {
                // Error
                if (result.data.meta.errorDetail) {
                    $scope.set.errors = result.data.meta.errorDetail;
                } else {
                    $scope.set.errors = ['There was an error contacting the server, please try again and contact us if you continue to have issues.'];
                }
            }
        }, function(error) {
            console.log(error);
            $scope.set.errors = ['There was an error contacting the server, please try again and contact us if you continue to have issues.'];
        });
    };

}]);

app.filter('camelCaseToHuman', function() {
    return function(input) {
        return input.charAt(0).toUpperCase() + input.substr(1).replace(/[A-Z]/g, ' $&');
    };
});
