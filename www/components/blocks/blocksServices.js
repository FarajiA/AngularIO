; (function () {
    angular.module('App').factory('Block', ['$http', '$q', 'UserObject', function ($http, $q, UserObject) {
        var data = [];
        var Block = {};

        Block.blocks = function (query, index) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;


            return deffered.promise;
        };

        Block.block = function (guid) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;


            return deffered.promise;
        };

        Block.data = function () { return data; };
        return Search;
    }]);

})();