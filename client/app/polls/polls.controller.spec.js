'use strict';

describe('Controller: PollsCtrl', function() {

	// load the controller's module
	beforeEach(module('buildAVotingAppApp'));
	beforeEach(module('socketMock'));

	var PollsCtrl,
		scope,
		$httpBackend;

	// Initialize the controller and a mock scope
	beforeEach(inject(function(_$httpBackend_, $controller, $rootScope) {
		$httpBackend = _$httpBackend_;
		$httpBackend.expectGET('/api/polls')
			.respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

		scope = $rootScope.$new();
		PollsCtrl = $controller('PollsCtrl', {
			$scope: scope
		});
	}));

	it('should attach a list of polls to the scope', function() {
		$httpBackend.flush();
		expect(scope.polls.length).toBe(4);
	});
});
