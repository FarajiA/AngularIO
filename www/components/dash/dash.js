; (function () {
    var app = angular.module('App');
    app.controller('DashController', ['$scope', 'UserObject', function ($scope, UserObject) {

        $scope.user = UserObject.data();

        if ($scope.user.broadcasting) {

        }

    }]);
})();