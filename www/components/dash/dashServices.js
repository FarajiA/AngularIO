; (function () {
    angular.module('App').factory('Dash', ['$http', '$q', 'UserObject', function ($http, $q, UserObject) {
        var data = [];
        var User = {};

        User.broadcast = function () {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;      
            var msg = { "guid": guid, "password": password };

            $http.put(baseURL + "api/users/broadcast/")
            .success(function (d) {
                data = d;
                deffered.resolve();
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        User.data = function () { return data };
        return User;
    }]);

})();