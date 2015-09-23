'use strict';

angular.module('votingAppApp')
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'app/main/main.html',
				controller: 'MainCtrl'
			})
			.when('/lazy', {
				templateUrl: 'app/main/main.html',
				controller: 'MainCtrl'
			})

		.when('/admin-panel', {
			templateUrl: 'app/admin/admin.html',
			controller: 'AdminCtrl'
		})

		.when('/:user/:poll', {
				templateUrl: 'app/polls/polls.html',
				controller: 'PollsCtrl'
			})
			.when('/:user/:poll/:results', {
				templateUrl: 'app/polls/polls.html',
				controller: 'PollsCtrl'
			});
	});
