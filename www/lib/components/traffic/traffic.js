; (function () {
    var app = angular.module('App');
    app.controller('TrafficController', ['$scope', 'Traffic', '$ionicPopup', '$ionicLoading', function ($scope, Traffic, $ionicPopup, $ionicLoading) {
        $scope.showChasers = true;
        $ionicLoading.show();
        $scope.imageURL = imageURL;

        $scope.doRefresh = function() {
            chasersInit();
            chasingInit();
        };

        $scope.$on('update_Chasers', function (event, args) {
            if (args.action === "chasers")
                chasersInit();
            if (args.action === "chasing")
                chasingInit();
        });

        var chasersInit = function () {            
            $scope.chasersindex = 0;
            Traffic.chasers($scope.chasersindex).then(function (data) {
                $ionicLoading.hide();
                $scope.chasers = data.Results;
                $scope.chasersNo = data.Total;
                $scope.noMoChasers = ($scope.chasersNo <= countSet);
                $scope.chasersindex++;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        chasersInit();

        $scope.loadMoreChasers = function () {
            var pagingMax = Math.ceil($scope.chasersNo / countSet, 1);
            if ($scope.chasersindex < pagingMax && $scope.chasersindex > 0) {
                Traffic.chasers($scope.chasersindex).then(function (data) {
                    var merged = $scope.chasers.concat(data.Results);
                    $scope.chasers = merged;
                    $scope.chasersindex++;
                });
            }
            else if ($scope.chasersindex == pagingMax)
                    $scope.noMoChasers = true;

            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        var chasingInit = function() {
            $scope.chasingindex = 0;
            Traffic.chasing($scope.chasingindex).then(function(data) {
                $ionicLoading.hide();
                $scope.chasing = data.Results;
                $scope.chasingNo = data.Total;
                $scope.noMoChasing = ($scope.chasingNo <= countSet);
                $scope.chasingindex++;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        chasingInit();

        $scope.loadMoreChasing = function () {
            var pagingMax = Math.ceil($scope.chasingNo / countSet, 1);
            if ($scope.chasingindex < pagingMax && $scope.chasersindex > 0) {
                Traffic.chasing($scope.chasingindex).then(function (data) {
                    var merged = $scope.chasing.concat(data.Results);
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