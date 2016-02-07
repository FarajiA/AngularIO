; (function () {
    angular.module('App').factory('Chasing', ['$http', '$q', 'UserObject', function ($http, $q, UserObject) {
        var data = [];
        var User = {};

        User.chasing = function (index, guid) {
            var deffered = $q.defer();

            $http.get(baseURL + "api/chasing/" + guid + "/" + index + "/" + countSet)
            .success(function (d) {
                data = d;
                deffered.resolve();
            })
            .error(function (data, status) {
                //console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        User.data = function () { return data };
        return User;
    }]);

})();