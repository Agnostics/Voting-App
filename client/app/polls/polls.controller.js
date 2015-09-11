'use strict';

angular.module('votingAppApp')
	.controller('PollsCtrl', function ($scope, $http, socket, $timeout, $location, $routeParams) {

		$scope.allPolls = [];
		$scope.userPoll = [];

		$scope.showAll = true;

		$http.get('/api/polls/' + $routeParams.user).success(function (polls) {
			$scope.allPolls = polls;
			socket.syncUpdates('poll', $scope.allPolls);
		});

		$http.get('/api/polls/' + $routeParams.user + '/' + $routeParams.poll).success(function (poll) {
			$scope.userPoll = poll;
			socket.syncUpdates('poll', $scope.userPoll);
			console.log($scope.userPoll);
			$scope.showAll = false;
		});

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('poll');
		});

		$scope.vote = function (url) {
			$location.path(url);
		};

		$scope.searchButton = function () {
			$scope.searched = $scope.search;
			$('body').removeClass('loaded');
			$timeout(function () {}, 0);
		};

	});
