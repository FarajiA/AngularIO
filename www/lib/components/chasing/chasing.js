; (function () {
    angular.module('App').controller('ChasingController', ['$scope', '$stateParams','$location', 'Chasing','$ionicLoading', function ($scope, $stateParams, $location, Chasing, $ionicLoading) {

        $scope.imageURL = imageURL;
        var userID = $stateParams.userId;
        var chasingInit = function () {
            $ionicLoading.show();
            $scope.index = 0;
            Chasing.chasing($scope.index, userID).then(function () {
                $scope.chasing = Chasing.data().Results;
                $scope.index++;
                $ionicLoading.hide();
            });
        };

        chasingInit();

        $scope.loadMoreChasing = function () {
            var chasingNo = Chasing.data().Total;
            var pagingMax = Math.ceil(chasingNo / countSet, 1);
            if ($scope.index < pagingMax && $scope.index > 0) {
                Chasing.chasing($scope.index, userID).then(function () {
                    var merged = $scope.chasing.concat(Chasing.data().Results);
                    $scope.chasing = merged;
                    $scope.index++;
                });
            }
            else if ($scope.index == pagingMax)
                $scope.noMoChasing = true;

            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        var path = $location.path().split("/") || "Unknown";
        $scope.segment = path[2];
    }]);
})();