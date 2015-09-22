'use strict';

describe('Controller: PollsCtrl', function () {

	// load the controller's module
	beforeEach(module('votingAppApp'));
	beforeEach(module('socketMock'));

	var PollsCtrl,
		scope,
		$httpBackend;

	// Initialize the controller and a mock scope
	beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
		$httpBackend = _$httpBackend_;
		$httpBackend.expectGET('/api/polls')
			.respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

		scope = $rootScope.$new();
		PollsCtrl = $controller('PollsCtrl', {
			$scope: scope
		});
	}));

});
