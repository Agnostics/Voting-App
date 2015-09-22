'use strict';

angular.module('votingAppApp')
	.controller('MainCtrl', function ($scope, $http, $location, $timeout, socket, Auth) {
		$scope.allPolls = [];
		$scope.latestPoll = [];
		$scope.pollQuestion = '';
		$scope.pollOptions = [];
		$scope.userCheck = false;

		$scope.colors = ['#97bbcd', '#dcdcdc', '#f7464a', '#46bfbd', '#fdb45c', '#949fb1', '#4d5360'];

		$scope.getColor = function () {
			for(var i = 0; i < $scope.pollOptions.length; i++) {
				$scope.pollOptions[i].color = $scope.colors[i];
			}
		};

		$scope.pollOptions = [{
			'value': 0,
			'color': '',
			'label': '',
			'per': 0
  }, {
			'value': 0,
			'color': '',
			'label': '',
			'per': 0

  }];

		$scope.optionNumber = 2;
		$scope.pollCount = 0;
		$scope.showPoll = false;
		$scope.finishPoll = false;
		$scope.showPollDone = false;
		$scope.sameTitle = false;
		$scope.err = false;
		$scope.tt = false;

		$scope.tooltipMSG = '';
		$scope.errMsg = '';
		$scope.replace = '';

		$http.get('/api/polls').success(function (poll) {
			$scope.allPolls = poll;
			$scope.pollCount = poll.length;
			socket.syncUpdates('poll', $scope.allPolls);

		});

		$scope.tooltip = function (val) {

			$scope.tt = true;

			if(val === 0) {
				$scope.tooltipMSG = 'Makes sure only users can vote.';
			}

			if(val === 1) {
				$scope.tooltipMSG = 'Allows multiple votes from the same location.';
			}

			if(val === 2) {
				$scope.tooltipMSG = 'Allows a new option to be created by the voter.';
			}

		};

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

			if($scope.pollOptions[0].label === '' || $scope.pollOptions[1].label === '') {
				$scope.err = true;
				$scope.errMsg = "Hmm.. did you forget an option?";
				return;
			}

			$scope.getColor();

			$http.post('/api/polls', {
				author: Auth.getCurrentUser().name || 'lazy',
				pollTitle: $scope.pollQuestion,
				pollName: $scope.pollQuestion.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '-').toString() + $scope.replace,
				url: '/' + (Auth.getCurrentUser().name || 'lazy') + '/' + $scope.pollQuestion.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '-') + $scope.replace,
				data: $scope.pollOptions,
				userCheck: $scope.userCheck
			});

			var last = $scope.allPolls.length;

			$location.path('/' + (Auth.getCurrentUser().name || 'lazy') + '/' + $scope.pollQuestion.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '-') + $scope.replace);
			$scope.latestPoll = $scope.allPolls[last];
			$scope.finishPoll = true;
			$scope.showPollDone = true;

		};

		$scope.addOption = function () {
			$scope.pollOptions.push({
				'value': 0,
				'color': '',
				'label': '',
				'per': 0

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
