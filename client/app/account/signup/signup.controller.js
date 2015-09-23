'use strict';

angular.module('votingAppApp')
	.controller('SignupCtrl', function ($scope, Auth, $location, $window) {

		$scope.user = {};
		$scope.errors = {};

		$scope.register = function (form) {
			$scope.submitted = true;

			if($scope.user.name !== undefined) {
				if($scope.user.name.search(/\s/g) !== -1 || $scope.user.name.search(/@/g) !== -1) {
					$scope.errors = {};
					form.name.$setValidity('mongoose', false);
					$scope.errors.name = 'Space or @ is not permitted within username.';
					$('#name').focus();
				}
			}

			if(form.$valid) {
				Auth.createUser({
						name: $scope.user.name,
						email: $scope.user.email,
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
						err = err.data;
						$scope.errors = {};

						// Update validity of form fields that match the mongoose errors
						angular.forEach(err.errors, function (error, field) {
							form[field].$setValidity('mongoose', false);
							$scope.errors[field] = error.message;
						});
					});
			}
		};

		$scope.loginOauth = function (provider) {
			$window.location.href = '/auth/' + provider;
		};
	});
