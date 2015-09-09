; (function () {
    var app = angular.module('App');
    app.controller('ActivityController', ['$scope', 'Activity', '$ionicPopup', '$rootScope', function ($scope, Activity, $ionicPopup, $rootScope) {

        $scope.showBroadcasters = true;

        $scope.broadcastingIndex = 0;
        Activity.broadcasting($scope.broadcastingIndex).then(function () {
            $scope.broadcasting = Activity.broadcastData().Results;
            $rootScope.broadcastingNo = Activity.broadcastData().Total;
            $scope.noMoBroadcasters = ($rootScope.broadcastingNo <= countSet);
            $scope.broadcastingIndex++;
        });

        $scope.loadMoreBroadcasters = function () {
            var pagingMax = Math.ceil($rootScope.broadcastingNo / countSet, 1);
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
            $rootScope.requestsNo = Activity.requestData().Total;
            $scope.noMoRequests = ($rootScope.requestsNo <= countSet);
            $scope.requestIndex++;
        });

        $scope.loadMoreRequests = function () {
            var pagingMax = Math.ceil($rootScope.requestsNo / countSet, 1);
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

        $scope.decision = function (guid, username, accept, index) {
            $scope.requestUsername = username;
            if (accept) {
                $scope.userRequest = requestConst.acceptRequestMsg.replace(/0/gi, $scope.requestUsername);
                var confirmPopup = $ionicPopup.confirm({
                    title: $scope.userRequest,
                    template: ''
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        Actitity.requestAccept(guid).then(function (response) {
                            var successful = Activity.data();
                            $scope.requests.splice(index, 1);
                            $rootScope.chasersNo = ($rootScope.chasersNo + 1);
                            $rootScope.requestsNo = ($rootScope.requestsNo - 1);
                        });
                    }
                });
            }
            else {
                $scope.userRequest = requestConst.declineRequestMsg.replace(/0/gi, $scope.requestUsername);
                var confirmPopup = $ionicPopup.confirm({
                    title: $scope.userRequest,
                    template: ''
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        Actitity.requestDecline(guid).then(function (response) {
                            var successful = Activity.data();
                            $scope.requests.splice(index, 1);
                            $rootScope.requestsNo = ($rootScope.requestsNo - 1);
                        });
                    }
                });
            }
        };


    }]);
})();