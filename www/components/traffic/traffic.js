; (function () {
    var app = angular.module('App');
    app.controller('TrafficController', ['$scope', 'UserObject', 'Traffic', function ($scope, UserObject, Traffic) {
        $scope.showChasers = true;
        $scope.chasersNo = UserObject.data().noChasers;
        $scope.chasingNo = UserObject.data().noChasing;

        $scope.toggle = function () {
            $scope.showChasers = !$scope.showChasers;
        };

        $scope.chasersindex = 0;
        Traffic.chasers($scope.chasersindex).then(function (data) {
            $scope.chasers = data;
            $scope.chasersindex++;
        });


        $scope.chasingindex = 0;
        Traffic.chasing($scope.chasingindex).then(function (data) {
            $scope.chasing = data;
            $scope.chasingindex++;
        });
    }]);
})();