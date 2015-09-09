; (function () {
    var app = angular.module('App');
    app.controller('TrafficController', ['$scope', 'Traffic', '$ionicPopup', '$rootScope', function ($scope, Traffic, $ionicPopup, $rootScope) {
        $scope.showChasers = true;

        $scope.chasersindex = 0;
        Traffic.chasers($scope.chasersindex).then(function (data) {
            $scope.chasers = data.Results;
            $rootScope.chasersNo = data.Total;
            $scope.noMoChasers = ($scope.chasersNo <= countSet);
            $scope.chasersindex++;
        });

        $scope.loadMoreChasers = function () {
            var pagingMax = Math.ceil($scope.chasersNo / countSet, 1);
            if ($scope.chasersindex < pagingMax && $scope.chasersindex > 0) {
                Traffic.chasers($scope.chasersindex).then(function (data) {
                    var merged = data.Results.concat($scope.chasers);
                    $scope.chasers = merged;
                    $scope.chasersindex++;
                });
            }
            else if ($scope.chasersindex == pagingMax)
                    $scope.noMoChasers = true;

            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        $scope.chasingindex = 0;
        Traffic.chasing($scope.chasingindex).then(function (data) {
            $scope.chasing = data.Results;
            $rootScope.chasingNo = data.Total;
            $scope.noMoChasing = ($scope.chasingNo <= countSet);
            $scope.chasingindex++;
        });

        $scope.loadMoreChasing = function () {
            var pagingMax = Math.ceil($scope.chasingNo / countSet, 1);
            if ($scope.chasingindex < pagingMax && $scope.chasersindex > 0) {
                Traffic.chasing($scope.chasingindex).then(function (data) {
                    var merged = data.Results.concat($scope.chasing);
                    $scope.chasing = merged;
                    $scope.chasingindex++;
                });
            }
            else if ($scope.chasingindex == pagingMax)
                $scope.noMoChasing = true;

            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        $scope.remove = function (guid,username,index) {
            var confirmPopup = $ionicPopup.confirm({
                title: deleteUserConst.removeUserTitle,
                template: ''
            });
            confirmPopup.then(function (res) {
                if (res) {
                    Traffic.unfollow(guid).then(function (response) {
                        var successful = response;
                        $scope.chasers.splice(index, 1);
                        $scope.chasersNo = ($scope.chasersNo - 1);
                    });
                } 
            });
        };

    }]);
})();