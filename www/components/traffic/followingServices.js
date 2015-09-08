; (function () {
    angular.module('main').factory('Following', function ($http, $q, UserObject) {
        var data = [];
        var User = {};
        /*
        Paging logic abandoned at service level
        var index = function (val) {
            var value = val > 0 ? val:0;
            this.getValue = function () {
                return value;
            };
            this.setValue = function (val) {
                value = val;
            };
        };
        var findex = new index();
        var followerIndex = findex.getValue();
        findex.setValue(5);
        */

        User.following = function (index) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;

            $http.get(baseURL + "api/chasing/" + guid + "/" + index + "/" + countSet)
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