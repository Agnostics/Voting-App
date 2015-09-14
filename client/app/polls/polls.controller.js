'use strict';

angular.module('votingAppApp')
	.controller('PollsCtrl', function ($scope, $http, socket, $timeout, $location, $routeParams, Auth) {

		$scope.allPolls = [];
		$scope.userPoll = [];
		$scope.pageOwner = '';

		if(Auth.getCurrentUser().name === $routeParams.user) {

			$scope.pageOwner = 'my';
			$scope.currentPage = 'you';
		} else {
			$scope.pageOwner = $routeParams.user + "'s";
			$scope.currentPage = $routeParams.user;
		}

		if($routeParams.user === 'lazy') {
			$scope.pageOwner = 'Temparay';
			$scope.currentPage = 'unregistered users';

		}

		if($routeParams.poll === 'polls') {
			$scope.showAll = true;
		} else {
			$scope.showAll = false;
		}

		$http.get('/api/polls/' + $routeParams.user + '/' + $routeParams.poll).success(function (poll) {

			if($routeParams.poll === 'polls') {
				$scope.allPolls = poll;
			}

			if($routeParams.poll !== 'polls') {
				$scope.userPoll = poll;
			}

			socket.syncUpdates('poll', $scope.allPolls);

		});

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('poll');
		});

		$scope.link = function (url) {
			$location.path(url);
		};

		function functiontofindIndexByKeyValue(array, key, value) {

			for(var i = 0; i < array.length; i++) {

				if(array[i][key] === value) {
					return i;
				}
			}
			return null;
		}

		$scope.vote = function (option) {

			var index = functiontofindIndexByKeyValue($scope.userPoll[0].data, 'name', option);

			$scope.userPoll[0].data[index].value++;

			$http.put('/api/polls/' + $scope.userPoll[0]._id, $scope.userPoll[0]);
			socket.syncUpdates('poll', $scope.userPoll);

		};

		$scope.searchButton = function () {
			$scope.searched = $scope.search;
			$('body').removeClass('loaded');
			$timeout(function () {}, 0);
		};

	});
