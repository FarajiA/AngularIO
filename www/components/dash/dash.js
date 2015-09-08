; (function () {
    var app = angular.module('App');
    app.controller('DashController', ['$scope', 'UserObject', function ($scope, UserObject) {
        // reusable authorization
       
        console.log("Enter dashboard controller");
        $scope.user = UserObject.data();

    }]);
})();