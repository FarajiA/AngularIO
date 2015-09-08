; (function () {
    var app = angular.module('App');
    app.controller('ContactsController', ['$scope', '$location', '$ionicHistory', function ($scope, $location, $ionicHistory) {
        // reusable authorization

        console.log("Enter contacts controller");


        $scope.back = function () {
            $ionicHistory.goBack();
        }


    }]);
})();