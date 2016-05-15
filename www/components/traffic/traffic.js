; (function () {
    var app = angular.module('App');
    app.controller('TrafficController', ['$scope', '$q', 'Traffic', '$ionicPopup', '$ionicLoading', function ($scope, $q, Traffic, $ionicPopup, $ionicLoading) {
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

        $scope.$on('update_Chasers_block', function (event, args) {
            $scope.doRefresh();
        });

        var chasersInit = function () {            
            $scope.chasersindex = 0;
            Traffic.chasers($scope.chasersindex).then(function (data) {
                $ionicLoading.hide();
                $scope.chasers = data.Results;
                $scope.chasersNo = data.Total;
                $scope.moChasers = ($scope.chasersNo > countSet);
                $scope.chasersindex++;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        chasersInit();

        $scope.loadMoreChasers = function () {
            var deffered = $q.defer();
            var pagingChaserMax = Math.ceil($scope.chasersNo / countSet, 1);
            if ($scope.chasersindex < pagingChaserMax && $scope.chasersindex > 0) {
                Traffic.chasers($scope.chasersindex).then(function (data) {
                    var chaserMerged = $scope.chasers.concat(data.Results);
                    $scope.chasersNo = data.Total;
                    $scope.chasers = chaserMerged;
                    $scope.chasersindex++;
                    $scope.moChasers = ($scope.chasers.length < $scope.chasersNo);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    deffered.resolve();
                });
            }
            else if ($scope.chasersindex >= pagingChaserMax)
                    $scope.moChasers = false;           

            return deffered.promise;
        };

        var chasingInit = function() {
            $scope.chasingindex = 0;
            Traffic.chasing($scope.chasingindex).then(function(data) {
                $ionicLoading.hide();
                $scope.chasing = data.Results;
                $scope.chasingNo = data.Total;
                $scope.moChasing = ($scope.chasingNo > countSet);
                $scope.chasingindex++;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        chasingInit();

        $scope.loadMoreChasing = function () {
            var deffered = $q.defer();
            var pagingChasingMax = Math.ceil($scope.chasingNo / countSet, 1);
            if ($scope.chasingindex < pagingChasingMax && $scope.chasingindex > 0) {
                Traffic.chasing($scope.chasingindex).then(function (data) {
                    var chasingMerged = $scope.chasing.concat(data.Results);
                    $scope.chasingNo = data.Total;
                    $scope.chasing = chasingMerged;
                    $scope.moChasing = ($scope.chasing.length < $scope.chasingNo)
                    $scope.chasingindex++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    deffered.resolve();
                });
            }
            else if ($scope.chasingindex >= pagingChasingMax)
                $scope.moChasing = false;

            return deffered.promise;
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