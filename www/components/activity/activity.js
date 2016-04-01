; (function () {
    var app = angular.module('App');
    app.controller('ActivityController', ['$scope', '$q', 'Activity', '$ionicPopup', '$rootScope', '$ionicLoading', function ($scope, $q, Activity, $ionicPopup, $rootScope, $ionicLoading) {

        $scope.showBroadcasters = true;
        $ionicLoading.show();
        $scope.imageURL = imageURL;

        $scope.doRefresh = function () {
            activityInit();
            requestInit();
        };

        var activityInit = function () {
            $scope.broadcastingIndex = 0;
            Activity.broadcasting($scope.broadcastingIndex).then(function () {
                $ionicLoading.hide();
                $scope.broadcasting = Activity.broadcastData().Results;
                $scope.broadcastingNo = Activity.broadcastData().Total;
                $scope.moBroadcasters = ($scope.broadcastingNo > countSet);
                $scope.broadcastingIndex++;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        activityInit();

        $scope.loadMoreBroadcasters = function () {
            var deffered = $q.defer();
            var pagingBroadcastingMax = Math.ceil($scope.broadcastingNo / countSet, 1);
            if ($scope.broadcastingIndex < pagingBroadcastingMax && $scope.broadcastingIndex > 0) {
                Activity.broadcasting($scope.broadcastingIndex).then(function () {
                    var merged = $scope.broadcasting.concat(Activity.broadcastData().Results);
                    $scope.broadcastingNo = Activity.broadcastData().Total;
                    $scope.broadcasting = merged;
                    $scope.moBroadcasters = ($scope.broadcasting.length < $scope.broadcastingNo)
                    $scope.broadcastingIndex++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    deffered.resolve();
                });
            }
            else if ($scope.broadcastingIndex >= pagingBroadcastingMax)
                $scope.moBroadcasters = false;

            return deffered.promise;
        };

        var requestInit = function () {
            $scope.requestIndex = 0;
            Activity.request($scope.requestIndex).then(function () {
                $ionicLoading.hide();
                $scope.requests = Activity.requestData().Results;
                $scope.requestsNo = Activity.requestData().Total;
                $scope.moRequests = ($scope.requestsNo > countSet);
                $scope.requestIndex++;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        requestInit();

        $scope.loadMoreRequests = function () {
            var deffered = $q.defer();
            var pagingRequestMax = Math.ceil($rootScope.requestsNo / countSet, 1);
            if ($scope.requestIndex < pagingRequestMax && $scope.requestIndex > 0) {
                Activity.request($scope.requestIndex).then(function () {
                    var merged = $scope.requests.concat(Activity.requestData().Results);
                    $scope.requestsNo = Activity.requestData().Total;
                    $scope.requests = merged;
                    $scope.moRequests = ($scope.requests.length < $scope.requestsNo)
                    $scope.requestIndex++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    deffered.resolve();
                });
            }
            else if ($scope.requestIndex >= pagingRequestMax)
                $scope.moRequests = false;


            return deffered.promise;
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
                        Activity.requestAccept(guid).then(function (response) {
                            var successful = Activity.data();
                            $scope.requests.splice(index, 1);
                            $scope.requestsNo = ($scope.requestsNo - 1);
                            $scope.$emit('emit_Chasers', { action: "chasers" });
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
                        Activity.requestDecline(guid).then(function (response) {
                            var successful = Activity.data();
                            $scope.requests.splice(index, 1);
                            $scope.requestsNo = ($scope.requestsNo - 1);
                        });
                    }
                });
            }
        };

        $scope.$on('update_activity', function (event, args) {
            $scope.doRefresh();
        });

    }]);
})();