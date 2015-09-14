'use strict';

angular.module('votingAppApp')
	.config(function($routeProvider) {
		$routeProvider
			.when('/polls', {
				templateUrl: 'app/polls/polls.html',
				controller: 'PollsCtrl'
			});
	});
