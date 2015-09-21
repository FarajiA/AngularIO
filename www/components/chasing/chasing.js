; (function () {
    angular.module('App').controller('ChasingController', ['$scope', '$stateParams', 'Chasing', function ($scope, $stateParams, Chasing) {

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
                Chasing.chasing($scope.index, userID).then(function (data) {
                    var merged = data.Results.concat($scope.chasing);
                    $scope.chasing = merged;
                    $scope.index++;
                });
            }
            else if ($scope.index == pagingMax)
                $scope.noMoChasing = true;

            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

    }]);
})();