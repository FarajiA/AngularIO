; (function () {
    angular.module('App').factory('SearchService', function ($http, $q, UserObject) {
        var data = [];
        var Search = {};

        Search.results = function (query, index) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;

            $http.get(baseURL + "api/search/" + query + "/" + index + "/" + countSet + "/" + guid)
            .success(function (d) {
                data = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                //console.log("Request failed " + status);
            });

            return deffered.promise;
        };

        Search.data = function () { return data; };
        return Search;
    });

})();