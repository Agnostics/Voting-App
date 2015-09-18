'use strict';

angular.module('votingAppApp')
	.controller('NavbarCtrl', function ($scope, $location, Auth, $route, $routeParams) {
		$scope.menu = [{
			'title': 'Home',
			'link': '/'
    }];

		$scope.isCollapsed = true;
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.isAdmin = Auth.isAdmin;
		$scope.getCurrentUser = Auth.getCurrentUser;

		$scope.logout = function () {
			Auth.logout();
			$location.path('/login');
		};

		$scope.go = function (path) {
			$location.path(path);
		};

		$scope.reload = function () {

			$route.reload();
			$scope.go('/');

		};

		$scope.myPolls = function () {

			return '/' + Auth.getCurrentUser().name + '/polls';

		};

		$scope.isActive = function (route) {
			return route === $location.path();
		};

		$scope.reloadRoute = function () {
			$route.reload();
		};
	});
