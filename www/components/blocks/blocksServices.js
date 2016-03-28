; (function () {
    angular.module('App').factory('Block', ['$http', '$q', 'UserObject', function ($http, $q, UserObject) {       
        var Block = {};

        Block.blocks = function (index) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;
            $http.get(baseURL + "api/blocks/" + UserObject.data().GUID + "/" + index + "/" + countSet)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Block.block = function (guid) {
            var deffered = $q.defer();
            var msg = { "blocker": UserObject.data().GUID, "block": guid };
            $http.post(baseURL + "api/block", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Block.DeleteBlock = function (ID) {
            var deffered = $q.defer();


            return deffered.promise;

        };

        return Block;
    }]);

})();