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
		$scope.sameTitle = false;
		$scope.err = false;
		$scope.errMsg = '';
		$scope.replace = '';

		$http.get('/api/polls').success(function (poll) {
			$scope.allPolls = poll;
			$scope.pollCount = poll.length;
			socket.syncUpdates('poll', $scope.allPolls);

		});

		$scope.addPoll = function () {

			for(var i = 0; i < $scope.allPolls.length; i++) {
				if($scope.allPolls[i].pollTitle === $scope.pollQuestion && $scope.allPolls[i].author === (Auth.getCurrentUser().name || 'lazy')) {
					$scope.replace = $scope.pollCount.toString();
				}
			}

			if($scope.pollQuestion === '') {
				$scope.err = true;
				$scope.errMsg = "Uh, what's the question?";
				return;
			}

			if($scope.pollOptions[0].name === '' || $scope.pollOptions[1].name === '') {
				$scope.err = true;
				$scope.errMsg = "Hmm.. did you forget an option?";
				return;
			}
			$http.post('/api/polls', {
				author: Auth.getCurrentUser().name || 'lazy',
				pollTitle: $scope.pollQuestion,
				pollName: $scope.pollQuestion.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '-').toString() + $scope.replace,

				url: '/' + (Auth.getCurrentUser().name || 'lazy') + '/' + $scope.pollQuestion.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '-') + $scope.replace,
				data: $scope.pollOptions
			});

			var last = $scope.allPolls.length;

			$location.path('/' + (Auth.getCurrentUser().name || 'lazy') + '/' + $scope.pollQuestion.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '-') + $scope.replace);
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

			if($scope.pollOptions.length > 2) {
				$scope.pollOptions.splice(index, 1);
			} else {
				$scope.err = true;
				$scope.errMsg = "You need at least 2 options..";
				return;
			}

		};

		$scope.go = function (path) {
			$location.path(path);
		};

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('poll');
		});
	});
