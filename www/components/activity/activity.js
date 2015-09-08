; (function () {
    var app = angular.module('App');
    app.controller('ActivityController', ['$scope', 'Activity', function ($scope, Activity) {

        $scope.showBroadcasters = true;

        $scope.broadcastingIndex = 0;
        Activity.broadcasting($scope.broadcastingIndex).then(function () {
            $scope.broadcasting = Activity.broadcastData().Results;
            $scope.broadcastingNo = Activity.broadcastData().Total;
            $scope.noMoBroadcasters = ($scope.broadcastingNo <= countSet);
            $scope.broadcastingIndex++;
        });

        $scope.loadMoreBroadcasters = function () {
            var pagingMax = Math.ceil($scope.broadcastingNo / countSet, 1);
            if ($scope.broadcastingIndex < pagingMax && $scope.broadcastingIndex > 0) {
                Activity.broadcasting($scope.broadcastingIndex).then(function (data) {
                    var merged = data.Results.concat($scope.broadcasting);
                    $scope.broadcasting = merged;
                    $scope.broadcastingIndex++;
                });
            }
            else if ($scope.broadcastingIndex == pagingMax)
                $scope.noMoBroadcasters = true;

            $scope.$broadcast('scroll.infiniteScrollComplete');
        };


        $scope.requestIndex = 0;
        Activity.request($scope.requestIndex).then(function () {
            $scope.requests = Activity.requestData().Results;
            $scope.requestsNo = Activity.requestData().Total;
            $scope.noMoRequests = ($scope.requestsNo <= countSet);
            $scope.requestIndex++;
        });

        $scope.loadMoreRequests = function () {
            var pagingMax = Math.ceil($scope.requestsNo / countSet, 1);
            if ($scope.requestIndex < pagingMax && $scope.requestIndex > 0) {
                Activity.request($scope.requestIndex).then(function (data) {
                    var merged = data.Results.concat($scope.requests);
                    $scope.requests = merged;
                    $scope.requestIndex++;
                });
            }
            else if ($scope.requestIndex == pagingMax)
                $scope.noMoRequests = true;

            $scope.$broadcast('scroll.infiniteScrollComplete');
        };


        $scope.accept = function (guid) {
            console.log("Accept: " + guid);
            /*
            Activity.requestAccept(guid).then(function () {
                $scope.accepted = Activity.data();
            });
            */
        };

        $scope.decline = function (guid) {
            console.log("Decline: " + guid);
            /*
            Activity.requestDecline(guid).then(function () {
                $scope.declined = Activity.data();
            });
            */
        };


    }]);
})();