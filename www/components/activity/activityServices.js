; (function () {
    angular.module('App').factory('Activity', function ($http, $q, UserObject) {
        var broadcastData = [];
        var requestData = [];
        var data = [];
        var User = {};

        User.broadcasting = function (index) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;

            $http.get(baseURL + "api/activity/" + guid + "/" + index + "/" + countSet, {
                cache: false
            })
            .success(function (d) {
                broadcastData = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });

            return deffered.promise;
        };

        User.request = function (index) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;

            $http.get(baseURL + "api/requests/" + guid + "/0/" + index + "/" + countSet, {
                cache: false
            })
            .success(function (d) {
                requestData = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });

            return deffered.promise;
        };

        User.requestDecline = function (userGuid) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;
            $http.delete(baseURL + "api/requests/" + userGuid + "/" + guid + "/0/0")
            .success(function (d) {
                data = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });

            return deffered.promise;
        };

        User.requestAccept = function (userGuid) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;
            var msg = { "requester": userGuid, "requestee": guid };
            $http.put(baseURL + "api/requests/0/0/0/0", msg)
            .success(function (d) {
                data = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });

            return deffered.promise;
        };

        User.broadcastData = function () { return broadcastData; };
        User.requestData = function () { return requestData; };
        User.data = function () { return data };
        return User;
    });

})();