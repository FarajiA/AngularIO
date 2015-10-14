; (function () {
    angular.module('App').controller('SearchController', ['$scope', 'SearchService', function ($scope, SearchService) {

        $scope.noMoSearch = true;
        $scope.searchIndex = { index: 0 }
        $scope.searchCount = { figure: 0 }
        $scope.searchresults = { array: [] }
        $scope.initial = { first: true }
        $scope.imageURL = imageURL;

        $scope.loadMoreSearch = function (search) {           
                var pagingMax = Math.ceil($scope.searchCount.figure / countSet, 1);
                var s = search;
                if ($scope.searchIndex.index < pagingMax && $scope.searchIndex.index > 0) {
                    SearchService.results(s, $scope.searchIndex.index).then(function () {
                        $scope.count = SearchService.data().Total;
                        if (!($scope.searchresults.array.length == $scope.count)) {
                            var merged = SearchService.data().Results.concat($scope.searchresults.array);
                            $scope.searchresults.array = merged;
                            $scope.searchIndex.index++;
                        }
                        else
                            return;
                    });
                }
                else if ($scope.searchIndex.index >= pagingMax)
                    $scope.noMoSearch = true;

             $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        

    }]);
})();