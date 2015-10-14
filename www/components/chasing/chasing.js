; (function () {
    angular.module('App').controller('ChasingController', ['$scope', '$stateParams','$location', 'Chasing', function ($scope, $stateParams, $location, Chasing) {

        $scope.imageURL = imageURL;
        var userID = $stateParams.userId;
        var chasingInit = function () {
            $scope.index = 0;
            Chasing.chasing($scope.index, userID).then(function () {
                $scope.chasing = Chasing.data().Results;
                $scope.index++;
            });
        };

        chasingInit();

        $scope.loadMoreChasing = function () {
            var chasingNo = Chasing.data().Total;
            var pagingMax = Math.ceil(chasingNo / countSet, 1);
            if ($scope.index < pagingMax && $scope.index > 0) {
                Chasing.chasing($scope.index, userID).then(function () {
                    var merged = Chasing.data().Results.concat($scope.chasing);
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