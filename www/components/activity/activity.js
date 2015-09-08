; (function () {
    var app = angular.module('App');
    app.controller('ActivityController', ['$scope', 'UserObject','Activity', function ($scope, UserObject, Activity) {

        $scope.showBroadcasters = true;
        $scope.toggle = function () {
            $scope.showBroadcasters = !$scope.showBroadcasters;
        }

        $scope.broadcastingIndex = 0;
        Activity.broadcasting($scope.broadcastingIndex).then(function () {
            $scope.broadcasting = Activity.broadcastData();
            $scope.broadcastingIndex++;
        });

        $scope.requestIndex = 0;
        Activity.request($scope.requestIndex).then(function () {
            $scope.requests = Activity.requestData();
            $scope.requestIndex++;
        });

        $scope.accept = function (guid) {
            Activity.requestAccept(guid).then(function () {
                $scope.accepted = Activity.data();
            });
        };

        $scope.decline = function (guid) {
            Activity.requestDecline(guid).then(function () {
                $scope.declined = Activity.data();
            });
        };

        $scope.UserDetails = function (guid) {
            UserObject.getUser(guid).then(function () {
                $location.path("/user/" + UserObject.details().username);
            });
        }
    }]);
})();