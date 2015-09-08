; (function () {
    var app = angular.module('App');
    app.controller('DashController', ['$scope', '$rootScope', 'UserObject', function ($scope, $rootScope, UserObject) {
        // reusable authorization
        console.log("Enter dashboard controller");
        $rootScope.title = "Dashboard";

    }]);

    app.controller('TrafficController', ['$scope', '$rootScope', 'UserObject', function ($scope, $rootScope, UserObject) {
            // reusable authorization
        console.log("Enter traffic controller");
        $rootScope.title = "Traffic";
    }]);

    app.controller('ActivityController', ['$scope', '$rootScope', 'UserObject', function ($scope, $rootScope, UserObject) {
            // reusable authorization

        console.log("Enter activity controller");
        $rootScope.title = "Activity";
    }]);

    app.controller('ContactsController', ['$scope', '$rootScope', 'UserObject', function ($scope, $rootScope, UserObject) {
           // reusable authorization
        console.log("Enter contacts controller");
        $rootScope.title = "Contacts";
    }]);

})();