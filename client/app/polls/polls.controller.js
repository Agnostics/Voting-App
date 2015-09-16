'use strict';

angular.module('votingAppApp')
	.controller('PollsCtrl', function ($scope, $http, socket, $timeout, $location, $routeParams, Auth) {

		$scope.allPolls = [];
		$scope.userPoll = [];
		$scope.pageOwner = '';
		$scope.remove = false;
		$scope.options = false;
		$scope.nothing = false;
		$scope.results = false;
		$scope.total = 0;
		$scope.totalArr = [];

		$scope.colors = ['#97bbcd', '#dcdcdc', '#f7464a', '#46bfbd', '#fdb45c', '#949fb1', '#4d5360'];

		$scope.labels = [];
		$scope.data = [];

		if(Auth.getCurrentUser().name === $routeParams.user) {

			$scope.pageOwner = 'my ';
			$scope.currentPage = 'you';
			$scope.remove = true;
		} else {
			$scope.pageOwner = $routeParams.user + "'s ";
			$scope.currentPage = $routeParams.user;
			$scope.remove = false;
		}

		if($routeParams.user === 'lazy') {
			$scope.pageOwner = 'Temparay ';
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
				$scope.options = false;

			}

			if($routeParams.poll !== 'polls') {
				$scope.userPoll = poll;
				$scope.options = true;

			}
			if($routeParams.results === 'results' && $scope.userPoll[0] !== undefined) {
				$scope.results = true;
				$scope.options = false;
				$scope.showAll = false;

				$scope.userPoll[0].data.forEach(function (elem) {
					$scope.total += elem.value;
					$scope.labels.push(elem.label);
					$scope.data.push(elem.value);

				});

				for(var i = 0; i < $scope.userPoll[0].data.length; i++) {

					var temp = ($scope.userPoll[0].data[i].value / $scope.total) * 100;

					$scope.userPoll[0].data[i].per = temp;
				}

				socket.syncUpdates('poll', $scope.userPoll, function () {
					$scope.labels = [];
					$scope.data = [];
					$scope.labelstemp = [];
					$scope.datatemp = [];
					$scope.total = 0;

					$scope.userPoll[0].data.forEach(function (elem) {
						$scope.total += elem.value;

						$scope.labelstemp.push(elem.label);
						$scope.datatemp.push(elem.value);

					});

					$scope.labels = $scope.labelstemp;
					$scope.data = $scope.datatemp;

					for(var i = 0; i < $scope.userPoll[0].data.length; i++) {

						var temp = ($scope.userPoll[0].data[i].value / $scope.total) * 100;

						$scope.userPoll[0].data[i].per = temp;
					}

				});

			} else if($routeParams.results !== '' && $routeParams.results !== 'results') {

				$scope.link('/' + $routeParams.user + '/' + $routeParams.poll);

			}

			if(poll.length < 1) {
				$scope.nothing = true;
				$scope.options = false;

			}

			socket.syncUpdates('poll', $scope.allPolls);

		});

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('poll');
		});

		$scope.deletePoll = function (poll) {

			if($routeParams.user === Auth.getCurrentUser()) {

				$http.delete('/api/polls/' + poll._id);
			}

		};

		$scope.link = function (url) {

			if(url === 'results') {
				$location.path('/' + $routeParams.user + '/' + $routeParams.poll + '/' + 'results');
			} else {
				$location.path(url);
			}

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

			var index = functiontofindIndexByKeyValue($scope.userPoll[0].data, 'label', option);

			$scope.userPoll[0].data[index].value++;

			$http.put('/api/polls/' + $scope.userPoll[0]._id, $scope.userPoll[0]);
			socket.syncUpdates('poll', $scope.userPoll);

			$location.path('/' + $routeParams.user + '/' + $routeParams.poll + '/' + 'results');

		};

		$scope.searchButton = function () {
			$scope.searched = $scope.search;
			$('body').removeClass('loaded');
			$timeout(function () {}, 0);
		};

	});
