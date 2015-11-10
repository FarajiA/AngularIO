; (function () {
    var app = angular.module('App');
    app.controller('ContactsController', ['$scope', '$location', '$ionicHistory', '$cordovaContacts', '$cordovaSms', '$ionicPlatform', '$ionicPopup', '$ionicLoading', '$state', function ($scope, $location, $ionicHistory, $cordovaContacts, $cordovaSms, $ionicPlatform, $ionicPopup, $ionicLoading, $state) {
        
        $ionicLoading.show();
        $scope.back = function () {
            $state.go('main.dash');
        };
        var opts = {                    
            fields: ['displayName', 'name', 'phoneNumbers']
        };

        if (ionic.Platform.isAndroid()) {
            opts.hasPhoneNumber = true; 
        };

        $scope.contactsFinished = false;
        $scope.contacts = [];
        var cSort = function (a, b) {
            aName = a.name;
            bName = b.name;
            return aName < bName ? -1 : (aName == bName ? 0 : 1);
        };
        $cordovaContacts.find(opts).then(function (allContacts) {
            $ionicLoading.hide();

            for (var i = 0; i < allContacts.length; i++) {
                if (allContacts[i].phoneNumbers != null && allContacts[i].phoneNumbers[0].type === 'mobile') {
                    var contactphone = allContacts[i].phoneNumbers;
                    var phonetype = contactphone[0].type;
                    var phonenumber = contactphone[0].value;
                    var name = allContacts[i].displayName;
                    var contact = {
                        name: '',
                        phonenumber: ''
                    };                    
                    contact.name = name;
                    contact.phonenumber = phonenumber;
                    var idx = $scope.contacts.indexOf(contact);

                    $scope.contacts.push(contact);
                    $scope.contactsFinished = true;
                }
            }
            $scope.contacts.sort(cSort);
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
                var phonenumber = scope.contacts[i].phoneNumbers;
                $cordovaSms.send(phonenumber, 'Content test and stuff yea', options).then(function () {
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