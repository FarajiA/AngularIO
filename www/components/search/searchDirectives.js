; (function () {
    angular.module('App').directive('autoSearch', ['SearchService', function (SearchService) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('propertychange keyup paste', function () {
                        var value = elem.val();
                        var min = attrs.min;
                        if (value.length >= min) {
                            scope.$apply(function () {
                                SearchService.results(value, scope.searchIndex.index).then(function () {
                                    scope.searchCount.figure = SearchService.data().Total;
                                    scope.searchresults.array = SearchService.data().Results;
                                    scope.noMoSearch = (scope.searchCount.figure <= countSet);
                                    scope.searchIndex.index++;
                                });
                            });
                        }
                        else
                            scope.searchresults = {};

                    });
            }
        };
    }]);

})();