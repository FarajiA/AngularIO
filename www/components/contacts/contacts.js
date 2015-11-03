; (function () {
    var app = angular.module('App');
    app.controller('ContactsController', ['$scope', '$location', '$ionicHistory', '$cordovaContacts', '$cordovaSms', '$ionicPlatform', '$ionicPopup', function ($scope, $location, $ionicHistory, $cordovaContacts, $cordovaSms, $ionicPlatform, $ionicPopup) {
        
        $scope.back = function () {
            $ionicHistory.goBack();
        };
        var opts = {                    
            fields: ['displayName', 'name', 'phoneNumbers']
        };

        if (ionic.Platform.isAndroid()) {
            opts.hasPhoneNumber = true; 
        };

        $scope.contactsFinished = false;
        $scope.contacts = [];
        $cordovaContacts.find(opts).then(function (allContacts) {
            for (var i = 0; i < allContacts.length; i++) {
                if (null != allContacts[i].phoneNumbers) {
                    for (var j = 0; j < allContacts[i].phoneNumbers.length; j++) {
                        var idx = $scope.contacts.indexOf(allContacts[i]);
                        if (idx > -1)
                            $scope.contacts.push(allContacts[i]);

                        if (j === allContacts.phoneNumbers.length)
                            $scope.contactsFinished = true;
                    }
                }
            }
        });       

        $scope.selectedContacts = [];
        $scope.checkboxSelection = function checkboxSelection(contact) {
            var idx = $scope.selectedContacts.indexOf(contact);
            if (idx > -1) {
                $scope.selectedContacts.splice(idx, 1);
            }
            else {
                $scope.selectedContacts.push(contact);
            }
        };

        $scope.sendInvite = function () {
            for (var i = 0; i < $scope.contacts.length; i++) {
                $cordovaSms.send('phonenumber', 'SMS content', options).then(function () {
                    console.log('Done');
                }, function (error) {
                    $ionicPopup.alert({
                        title: SMS.error
                    }).then(function (res) {

                    });
                });
                continue;
            }
        };
        
    }]);
})();