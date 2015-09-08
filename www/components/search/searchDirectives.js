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
                                SearchService.results(value).then(function () {
                                    var initialData = scope.searchresults;
                                    scope.searchresults = SearchService.data();
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