; (function () {
    angular.module('App').controller('ChasersController', ['$scope', '$stateParams', '$location', 'Chasers', '$ionicLoading', function ($scope, $stateParams, $location, Chasers, $ionicLoading) {

        var userID = $stateParams.userId;
        $scope.imageURL = imageURL;

        var chasersInit = function () {
            $ionicLoading.show();
            $scope.index = 0;
            Chasers.chasers($scope.index, userID).then(function (response) {
                $scope.chasers = response.Results;
                $scope.index++;
                $ionicLoading.hide();
            }, function (error) {
                $ionicLoading.hide();
            });
        };

        chasersInit();

        $scope.loadMoreChasers = function () {
            var chasersNo = Chasers.data().Total;
            var pagingMax = Math.ceil(chasersNo / countSet, 1);
            if ($scope.index < pagingMax && $scope.index > 0) {
                Chasers.chasers($scope.index, userID).then(function (response) {
                    var merged = $scope.chasers.concat(response.Results);
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