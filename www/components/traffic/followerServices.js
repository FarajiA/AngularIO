; (function () {
    angular.module('main').factory('Followers', function ($http, $q, UserObject) {
        var data = [];
        var User = {};

        User.followers = function (index) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;          

            $http.get(baseURL + "api/chasers/" + guid + "/" + index + "/" + countSet)
            .success(function (d) {
                data = d;
                deffered.resolve();               
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        User.unfollow = function (guid) {
            var deffered = $q.defer();
            $http.delete(baseURL + "api/chasing/" + guid + "/" +  UserObject.data().GUID)
            .success(function (d) {
                data = d;
                deffered.resolve();
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        User.data = function () { return data; };
        return User;
    });

})();