'use strict';

angular.module('votingAppApp')
	.controller('MainCtrl', function ($scope, $http, $location, $timeout, socket, Auth) {
		$scope.allPolls = [];
		$scope.latestPoll = [];
		$scope.pollQuestion = '';
		$scope.pollOptions = [{
			'name': '',
			'value': 0
  }, {
			'name': '',
			'value': 0
  }];

		$scope.optionNumber = 2;
		$scope.pollCount = 0;
		$scope.showPoll = false;
		$scope.finishPoll = false;
		$scope.showPollDone = false;

		$http.get('/api/polls').success(function (poll) {
			$scope.allPolls = poll;
			socket.syncUpdates('poll', $scope.allPolls);

			$scope.pollCount = poll.length;
		});

		$scope.addPoll = function () {

			$http.post('/api/polls', {
				author: Auth.getCurrentUser().name || 'anonymous',
				pollTitle: $scope.pollQuestion,
				pollName: $scope.pollQuestion.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '-').toString(),
				url: '/' + (Auth.getCurrentUser().name || 'default') + '/' + $scope.pollQuestion.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '-'),
				data: [$scope.pollOptions]
			});

			var last = $scope.allPolls.length;

			$location.path('/' + (Auth.getCurrentUser().name || 'default') + '/' + $scope.pollQuestion.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '-'));
			$scope.latestPoll = $scope.allPolls[last];
			$scope.finishPoll = true;
			$scope.showPollDone = true;

		};

		$scope.addOption = function () {
			$scope.pollOptions.push({
				'name': '',
				'value': 0
			});
		};

		$scope.removeOption = function (index) {
			$scope.pollOptions.splice(index, 1);
		};

		$scope.go = function (path) {
			$location.path(path);
		};

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('poll');
		});
	});
