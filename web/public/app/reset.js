
require('../scss/reset.scss');
require('angular');

var app = angular.module('passwordApp',[]),
    query = require('./queryParams')(document.location.search);

// ok

app.controller('password', ['$scope', '$location', '$http', function($scope, $location, $http) {
    $scope.view = null;
    $scope.reset = {
        email: null,
        errors: []
    };
    $scope.set = {
        password: null,
        confirm: null,
        errors: []
    };

    function checkPasswordHash() {
        // Call Server to make sure hash is still valid
        $http.post(
            'https://api.seasonlink.co/v1/forgot-password/check',
            {
                email: query.email,
                hash: query.hash
            }
        ).then(function(result) {
            if (result.data && result.data.meta.code === 200) {
                $scope.view = 'set';
            } else {
                // Error
                $scope.reset.email = email;
                $scope.view = 'check-error';
            }
        }, function(error) {
            console.log(error);
            $scope.reset.errors = ['There was an error contacting the server, please try again and contact us if you continue to have issues.'];
        });
        // Set view on success
    }

    if (query.hash && query.email) {
        // Update Password
        checkPasswordHash();
    } else {
        // Reset Password
        $scope.view = 'reset';
    }

    $scope.resetPassword = function() {
        $http.post(
            'https://api.seasonlink.co/v1/forgot-password/reset',
            {
                email: $scope.reset.email
            }
        ).then(function(result) {
            if (result.data.response) {
                $scope.view = 'reset-success';
            } else {
                // Error
                if (result.data.meta.errorDetail) {
                    $scope.reset.errors = result.data.meta.errorDetail;
                } else {
                    $scope.reset.errors = ['There was an error contacting the server, please try again and contact us if you continue to have issues.'];
                }
            }
        }, function(error) {
            console.log(error);
            $scope.reset.errors = ['There was an error contacting the server, please try again and contact us if you continue to have issues.'];
        });
    };

    $scope.updatePassword = function() {
        if ($scope.set.password !== $scope.set.confirm) {
            $scope.set.errors = ['Your passwords do not match.'];
            return false;
        }

        // Call server with updated password
        $http.post(
            'https://api.seasonlink.co/v1/forgot-password/set',
            {
                email: query.email,
                hash: query.hash,
                password: $scope.set.password
            }
        ).then(function(result) {
            if (result.data && result.data.meta.code === 200) {
                $scope.view = 'set-success';
            } else {
                // Error
                if (result.data.meta.errorDetail) {
                    $scope.reset.errors = result.data.meta.errorDetail;
                } else {
                    $scope.reset.errors = ['There was an error contacting the server, please try again and contact us if you continue to have issues.'];
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
