'use strict';

angular.module('votingAppApp')
	.controller('LoginCtrl', function ($scope, Auth, $location, $window) {
		$scope.user = {};
		$scope.errors = {};

		$scope.login = function (form) {
			$scope.submitted = true;

			console.log($scope.user);

			if(form.$valid) {
				Auth.login({
						name: $scope.user.name,
						password: $scope.user.password
					})
					.then(function () {
						// Logged in, redirect to home
						$location.path('/');
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
