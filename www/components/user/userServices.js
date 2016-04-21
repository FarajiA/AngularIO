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
            deffered.resolve(d);
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
            deffered.resolve(d);
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
            deffered.resolve(d);
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
            $http.get(baseURL + "api/coordinates/" + guid, {
                cache : false
            })
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

    angular.module('App').factory('Report', ['$http', '$q', 'UserObject', function ($http, $q, UserObject) {
        var data = [];
        var Report = {};

        Report.Flag = function (flagged, snitched, type) {
            var deffered = $q.defer();
            var msg = { "ID": "0", "flagged": flagged, "snitched": snitched, "type": type };
            $http.post(baseURL + "api/flag", msg)
            .success(function (d) {
                data = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                $q.reject(status);
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Report.Flagged = function (flagged, snitched) {
            var deffered = $q.defer();
            $http.get(baseURL + "api/flag/" + flagged + "/" + snitched, {
                cache: false
            })
            .success(function (d) {
                data = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                $q.reject(status);
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Report.data = function () { return data; }
        return Report;
    }]);



})();
