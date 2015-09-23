'use strict';

angular.module('votingAppApp')
	.controller('PollsCtrl', function ($scope, $http, socket, $timeout, $location, $routeParams, Auth) {

		//Scope variables initialized
		$scope.allPolls = [];
		$scope.userPoll = [];
		$scope.pageOwner = '';
		$scope.remove = false;
		$scope.options = false;
		$scope.nothing = false;
		$scope.results = false;
		$scope.canVote = true;
		$scope.check = false;
		$scope.total = 0;
		$scope.totalArr = [];
		$scope.votedAlready = false;
		// $scope.userIP = '';

		//Dougnut Chart variables
		$scope.labels = [];
		$scope.data = [];
		$scope.textToCopy = '';

		//Checks user polls to see if they are the owner.
		if(Auth.getCurrentUser().name === $routeParams.user) {
			$scope.pageOwner = 'my ';
			$scope.currentPage = 'you';
			$scope.remove = true;
		} else {
			$scope.pageOwner = $routeParams.user + "'s ";
			$scope.currentPage = $routeParams.user;
			$scope.remove = false;
		}

		//Checks if user is not registered.
		if($routeParams.user === 'lazy') {
			$scope.pageOwner = 'Temparay ';
			$scope.currentPage = 'unregistered users';
		}

		//Get poll data
		$http.get('/api/polls/' + $routeParams.user + '/' + $routeParams.poll).success(function (poll) {

			//Show all polls if /polls
			if($routeParams.poll === 'polls') {
				$scope.allPolls = poll;
				$scope.showAll = true;
				$scope.options = false;
			}

			//Show user poll
			if($routeParams.poll !== 'polls') {

				$scope.userPoll = poll;
				$scope.showAll = false;
				$scope.options = true;
				$scope.getIP();
				$scope.textToCopy = $location.$$host + '/' + $routeParams.user + '/' + $routeParams.poll + '/';
			}

			//Show results if /results
			if($routeParams.results === 'results' && $scope.userPoll[0] !== undefined) {
				$scope.results = true;
				$scope.options = false;
				$scope.showAll = false;

				$scope.userPoll[0].data.forEach(function (elem) {
					$scope.total += elem.value;
					$scope.labels.push(elem.label);
					$scope.data.push(elem.value);

				});

				//Calculate percentages
				$scope.calculatePerct();

				//Sync data after every new entry.
				socket.syncUpdates('poll', $scope.userPoll, function () {
					$scope.labels = [];
					$scope.data = [];
					$scope.total = 0;

					//temp
					$scope.labelstemp = [];
					$scope.datatemp = [];

					$scope.userPoll[0].data.forEach(function (elem) {
						$scope.total += elem.value;
						$scope.labelstemp.push(elem.label);
						$scope.datatemp.push(elem.value);

					});

					$scope.labels = $scope.labelstemp;
					$scope.data = $scope.datatemp;

					$scope.calculatePerct();

				});

			} else if($routeParams.results !== '' && $routeParams.results !== 'results') {
				//if not results (Typo or something, return to voting page)
				$scope.link('/' + $routeParams.user + '/' + $routeParams.poll);
			}

			//Show 404 if no polls are found.
			if(poll.length < 1) {
				$scope.nothing = true;
				$scope.options = false;
			}

		});

		//Calculates the percentages
		$scope.calculatePerct = function () {
			for(var i = 0; i < $scope.userPoll[0].data.length; i++) {
				var temp = ($scope.userPoll[0].data[i].value / $scope.total) * 100;
				$scope.userPoll[0].data[i].per = temp;
			}
		};

		//Checks who voted and if your name matches, you cannot vote.
		$scope.checkVote = function () {

			$scope.userPoll[0].voted.forEach(function (elem) {
				if(elem === $scope.userIP) {
					$scope.canVote = false;

				} else {
					$scope.canVote = true;
					$scope.votedAlready = false;
				}

			});

		};

		$scope.getIP = function () {
			$http.get('/ip').success(function (ip) {
				$scope.userIP = ip;
			});
		};

		//Handles the operation when user clicks an option.
		$scope.vote = function (option) {
			$scope.checkVote();

			//If 'users only' is checked and you are not logged in, redirect to login page.
			if($scope.userPoll[0].userCheck && Auth.getCurrentUser().name === undefined) {
				$scope.canVote = false;
				$scope.requireLogin = true;
			}

			if($scope.canVote) {

				//Push name to voted array
				$scope.userPoll[0].voted.push($scope.userIP);

				//Find option user clicked and increases the value by 1.
				var index = findIndexByKeyValue($scope.userPoll[0].data, 'label', option);
				$scope.userPoll[0].data[index].value++;

				//Update poll value in database and sync to all users.
				$http.put('/api/polls/' + $scope.userPoll[0]._id, $scope.userPoll[0]);
				socket.syncUpdates('poll', $scope.userPoll);
				$scope.canVote = false;
				localStorage.url = '';

				//Redirects user to the results page.
				$location.path('/' + $routeParams.user + '/' + $routeParams.poll + '/' + 'results');

			} else {
				$scope.votedAlready = true;

				if($scope.requireLogin) {
					$scope.errMsg = ' Login is required to vote.';
					localStorage.url = $routeParams.user + '/' + $routeParams.poll;

				} else {
					$scope.errMsg = ' You already voted...';

				}

			}

		};

		//If the user signed in is viewing their own polls, then allow delete.
		$scope.deletePoll = function (poll) {
			if($routeParams.user === Auth.getCurrentUser().name) {
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

		$scope.go = function () {

		};

		function findIndexByKeyValue(array, key, value) {
			for(var i = 0; i < array.length; i++) {

				if(array[i][key] === value) {
					return i;
				}
			}
			return null;
		}

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('poll');
		});

	});
