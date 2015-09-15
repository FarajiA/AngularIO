; (function () {
    angular.module('App').factory('Decision', ['$http', '$q', 'UserObject', function ($http, $q, UserObject) {
    var data = [];
    var Decision = {};

    Decision.follow = function (guid) {
        var deffered = $q.defer();
        var msg = { "guid": UserObject.data().GUID, "chaser": guid };
        $http.post(baseURL + "api/chasing", msg)
        .success(function (d) {
            data = d;
            deffered.resolve();
        })
        .error(function (data, status) {
            console.log("Request failed " + status);
        });
        return deffered.promise;
    };

    Decision.unfollow = function (guid) {
        var deffered = $q.defer();
        $http.delete(baseURL + "api/chasing/" + UserObject.data().GUID + "/" + guid)
        .success(function (d) {
            data = d;
            deffered.resolve();
        })
        .error(function (data, status) {
            console.log("Request failed " + status);
        });
        return deffered.promise;
    };

    Decision.request = function (guid) {
        var deffered = $q.defer();
        var msg = { "requester": UserObject.data().GUID, "requestee": guid, "index": 0, "count":0 };
        $http.post(baseURL + "api/requests", msg)
        .success(function (d) {
            data = d;
            deffered.resolve();
        })
        .error(function (data, status) {
            console.log("Request failed " + status);
        });
        return deffered.promise;
    };

    Decision.data = function () { return data; };
    return Decision;
    }]);

    angular.module('App').factory('chaserBroadcast', ['$http', '$q', 'UserObject', function ($http, $q, UserObject) {
        var data = [];
        var Broadcast = {};

        Broadcast.coords = function (guid) {
            var deffered = $q.defer();
            var msg = { "guid": UserObject.data().GUID, "chaser": guid };
            $http.post(baseURL + "api/chasing", msg)
            .success(function (d) {
                data = d;
                deffered.resolve();
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Broadcast.data = function () { return data; }
        return Broadcast;
    }]);

})();
