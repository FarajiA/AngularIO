; (function () {
    angular.module('App').controller('SearchController', ['$scope', 'SearchService', function ($scope, SearchService) {

        $scope.noMoSearch = true;
        $scope.searchIndex = { index: 0 }
        $scope.searchCount = { figure: 0 }
        $scope.searchresults = {array: []}

        $scope.loadMoreSearch = function (search) {
            var pagingMax = Math.ceil($scope.searchCount.figure / countSet, 1);
            var s = search;
            if ($scope.searchIndex.index < pagingMax && $scope.searchIndex.index > 0) {
                SearchService.results(s, $scope.searchIndex.index).then(function () {
                    $scope.count = SearchService.data().Total;
                    var merged = SearchService.data().Results.concat($scope.searchresults.array);
                    $scope.searchresults.array = merged;
                    $scope.searchIndex.index++;
                });
            }
            else if ($scope.searchIndex.index == pagingMax)
                $scope.noMoChasers = true;

            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        

    }]);
})();