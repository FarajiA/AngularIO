; (function () {
    var app = angular.module('App');
    app.controller('ContactsController', ['$scope', '$location', '$ionicHistory', '$cordovaContacts', function ($scope, $location, $ionicHistory, $cordovaContacts) {
        
        $scope.back = function () {
            $ionicHistory.goBack();
        };
        /*
        $cordovaContacts.find().then(function(allContacts) { 
            $scope.contacts = allContacts;
        });
        */

    }]);
})();