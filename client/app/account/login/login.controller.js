'use strict';

angular.module('votingAppApp')
	.controller('LoginCtrl', function ($scope, Auth, $location, $window) {
		$scope.user = {};
		$scope.errors = {};

		$scope.login = function (form) {
			$scope.submitted = true;

			if(form.$valid) {
				Auth.login({
						name: $scope.user.name,
						password: $scope.user.password
					})
					.then(function () {

						if(localStorage.url === '' || localStorage.url === null || localStorage.url === undefined) {
							$location.path('/');
						} else {
							$location.path(localStorage.url);
						}

					})
					.catch(function (err) {
						$scope.errors.other = err.message;
					});
			}
		};

		$scope.loginOauth = function (provider) {
			$window.location.href = '/auth/' + provider;
		};
	});
