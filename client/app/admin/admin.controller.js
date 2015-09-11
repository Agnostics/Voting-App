'use strict';

angular.module('votingAppApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, socket) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();
    $scope.allPolls = [];


    $http.get('/api/polls').success(function(polls) {
      $scope.allPolls = polls;
      socket.syncUpdates('poll', $scope.allPolls);
    });

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

    $scope.deletePoll = function(poll) {
      $http.delete('/api/polls/' + poll._id);

    };

  });
