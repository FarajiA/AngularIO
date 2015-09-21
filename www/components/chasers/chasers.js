; (function () {
    angular.module('App').controller('ChasersController', ['$scope', '$stateParams', '$location', 'Chasers', function ($scope, $stateParams, $location, Chasers) {

        var userID = $stateParams.userId;

        var chasersInit = function () {
            $scope.index = 0;
            Chasers.chasers($scope.index, userID).then(function () {
                $scope.chasers = Chasers.data().Results;
                $scope.index++;
            });
        };

        chasersInit();

        $scope.loadMoreChasers = function () {
            var chasersNo = Chasers.data().Total;
            var pagingMax = Math.ceil(chasersNo / countSet, 1);
            if ($scope.index < pagingMax && $scope.index > 0) {
                Chasers.chasers($scope.index, userID).then(function () {
                    var merged = Chasers.data().Results.concat($scope.chasers);
                    $scope.chasers = merged;
                    $scope.index++;
                });
            }
            else if ($scope.index == pagingMax)
                $scope.noMoChasers = true;

            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        var path = $location.path().split("/") || "Unknown";
        $scope.segment = path[2];

    }]);
})();