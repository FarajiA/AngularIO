; (function () {
    var app = angular.module('App');
    app.controller('ContactsController', ['$scope', '$location','$cordovaContacts', '$cordovaSms', '$ionicPlatform', '$ionicPopup', '$ionicLoading', '$state', function ($scope, $location, $cordovaContacts, $cordovaSms, $ionicPlatform, $ionicPopup, $ionicLoading, $state) {
        
        $scope.$on('$ionicView.enter', function () {
            $ionicLoading.hide();
        });
      
        $scope.back = function () {
            $state.go('main.dash');
        };
        
        $scope.selectedContacts = [];
        $scope.checkboxSelection = function checkboxSelection(contact) {
            var idx = $scope.selectedContacts.indexOf(contact.phonenumber);
            if (idx > -1) {
                $scope.selectedContacts.splice(idx, 1);
            }
            else {
                $scope.selectedContacts.push(contact.phonenumber);
            }
        };

        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                intent: 'INTENT'  // send SMS with the native android SMS messaging
                //intent: '' // send SMS without open any other app
            }
        };

        $scope.sendInvites = function () {
            $ionicLoading.show();
            $cordovaSms.send($scope.selectedContacts, SMS.inviteContent.replace(/0/gi, $scope.username), options).then(function () {
                $ionicLoading.hide();
            }, function (error) {
                $ionicPopup.alert({
                    title: SMS.error
                }).then(function (res) {

                });
            });

        };
        
    }]);
})();