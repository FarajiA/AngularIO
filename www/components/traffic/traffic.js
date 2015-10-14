; (function () {
    var app = angular.module('App');
    app.controller('TrafficController', ['$scope', 'Traffic', '$ionicPopup', function ($scope, Traffic, $ionicPopup) {
        $scope.showChasers = true;
        $scope.imageURL = imageURL;
        $scope.$on('update_Chasers', function (event, args) {
            if (args.action === "chasers")
                chasersInit();
            if (args.action === "chasing")
                chasingInit();
        });

        var chasersInit = function () {
            $scope.chasersindex = 0;
            Traffic.chasers($scope.chasersindex).then(function (data) {
                $scope.chasers = data.Results;
                $scope.chasersNo = data.Total;
                $scope.noMoChasers = ($scope.chasersNo <= countSet);
                $scope.chasersindex++;
            });
        };

        chasersInit();

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
        
        var chasingInit = function () {
            $scope.chasingindex = 0;
            Traffic.chasing($scope.chasingindex).then(function (data) {
                $scope.chasing = data.Results;
                $scope.chasingNo = data.Total;
                $scope.noMoChasing = ($scope.chasingNo <= countSet);
                $scope.chasingindex++;
            });
        }

        chasingInit();

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