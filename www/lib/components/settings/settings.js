; (function () {
        var app = angular.module('App');
        app.controller('SettingsController', ['$scope', '$ionicPopup', '$timeout', 'UserObject', 'Settings', '$rootScope', '$state', function ($scope, $ionicPopup, $timeout, UserObject, Settings, $rootScope, $state) {
            $scope.form = {};
            $scope.oldpasswordInvalid = false;
            var OGuser;

            $scope.back = function () {
               $state.go('main.dash');
            };

            $scope.updatePassword = function () {
                $scope.data = {};
                $scope.form = {
                    passwordForm: {}
                };          
                // An elaborate, custom popup
                var myPopup = $ionicPopup.show({
                    templateUrl: 'components/settings/password-modal.html',
                    cssClass: 'passwordPopup',
                    title: 'Update Password',
                    scope: $scope,
                    buttons: [
                      { text: 'Cancel' },
                      {
                          text: '<b>Update</b>',
                          type: 'button-positive',
                          onTap: function (e) {
                             var valid = Settings.passwordValid($scope.data.oldpassword);
                             if ($scope.form.passwordForm.$valid) {
                                 if (valid) {
                                      Settings.updatePassword($scope.data.confirmpassword).then(function () {
                                          var successful = Settings.successfulPassword();
                                          if (successful)
                                                myPopup.close();
                                      });
                                  }
                                  else {
                                      e.preventDefault();
                                  }
                             } else {
                                  e.preventDefault();
                             }                                
                              
                          }
                      }
                    ]
                });/*  
                myPopup.then(function(res) {
                    console.log('Tapped!', res);
                });
                */
            };

            $scope.settingsSubmit = function (userSettings) {
                // check to make sure the form is completely valid
                if ($scope.form.settingsForm.$valid) {
                    Settings.updateUser(userSettings).then(function () {
                        $scope.$parent.user = Settings.data();

                       var alertPopup = $ionicPopup.alert({
                           title: 'Done homie!'
                       });
                       alertPopup.then(function (res) {
                           $state.go('main.dash');
                       });
                    });
                }
            };

            $scope.$on('$ionicView.enter', function () {
                $scope.userSettings = angular.copy($scope.$parent.user);

                if ($scope.userSettings.hasOwnProperty('firstName'))
                    $scope.userSettings.firstname = $scope.userSettings.firstName;
                if ($scope.userSettings.hasOwnProperty('lastName'))
                    $scope.userSettings.lastname = $scope.userSettings.lastName;
                if ($scope.userSettings.hasOwnProperty('emailAddress'))
                    $scope.userSettings.email = $scope.userSettings.emailAddress;
                if ($scope.userSettings.hasOwnProperty('private'))
                    $scope.userSettings.isprivate = $scope.userSettings.private;
            });
        }]);
})();