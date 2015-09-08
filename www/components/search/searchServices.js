; (function () {
    angular.module('App').factory('SearchService', function ($http, $q, UserObject) {
        var data = [];
        var Search = {};

        Search.results = function (query) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;

            $http.get(baseURL + "api/search/" + query + "/0/" + guid)
            .success(function (d) {
                data = d;
                deffered.resolve();
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });

            return deffered.promise;
        };

        Search.data = function () { return data; };
        return Search;
    });

})();