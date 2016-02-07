; (function () {
    angular.module('App').factory('Traffic', ['$http', '$q', 'UserObject', function ($http, $q, UserObject) {
        var getchasers = [];
        var getchasing = [];
        var User = {};

        User.chasers = function (index) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;

            $http.get(baseURL + "api/chasers/" + guid + "/" + index + "/" + countSet,{
                cache : false
            })
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };


        User.chasing = function (index) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;

            $http.get(baseURL + "api/chasing/" + guid + "/" + index + "/" + countSet,{
                cache : false
            })
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        User.unfollow = function (guid) {
            var deffered = $q.defer();
            $http.delete(baseURL + "api/chasing/" + guid + "/" + UserObject.data().GUID)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        return User;
    }]);

})();