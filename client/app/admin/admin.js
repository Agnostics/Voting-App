'use strict';

angular.module('votingAppApp')
	.config(function ($routeProvider) {
		$routeProvider
			.when('/admin-panel', {
				templateUrl: 'app/admin/admin.html',
				controller: 'AdminCtrl'
			});
	});
