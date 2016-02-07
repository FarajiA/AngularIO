; (function () {
    angular.module('App').factory('Dash', ['$http', '$q', 'UserObject', function ($http, $q, UserObject) {
        var data = [];
        var User = {};

        User.broadcast = function (lat, long, on) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;
            var msg = { "GUID": guid, "latitude": lat, "longitude": long, "on": on };

            $http.put(baseURL + "api/users/broadcast/", msg)
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