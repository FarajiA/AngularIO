; (function () {
    angular.module('App').factory('Chasers', ['$http', '$q', 'UserObject', function ($http, $q, UserObject) {
        var data = [];
        var User = {};

        User.chasers = function (index, guid) {
            var deffered = $q.defer();
            $http.get(baseURL + "api/chasers/" + guid + "/" + index + "/" + countSet,                
                {
                    headers : {"BlockGuid" : UserObject.data().GUID}
                })
            .success(function (d) {
                data = d;
                deffered.resolve(d);
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