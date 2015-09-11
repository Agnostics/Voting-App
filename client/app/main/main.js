'use strict';

angular.module('votingAppApp')
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'app/main/main.html',
				controller: 'MainCtrl'
			})
			.when('/:user', {
				templateUrl: 'app/polls/polls.html',
				controller: 'PollsCtrl'
			})
			.when('/:user/:poll', {
				templateUrl: 'app/polls/polls.html',
				controller: 'PollsCtrl'
			});
	});
