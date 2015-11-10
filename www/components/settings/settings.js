; (function () {
        var app = angular.module('App');
        app.controller('SettingsController', ['$scope', '$ionicPopup', '$timeout', 'UserObject', 'Settings', '$rootScope', '$state', function ($scope, $ionicPopup, $timeout, UserObject, Settings, $rootScope, $state) {
            $scope.form = {};
            $scope.user = $scope.$parent.user;
            $scope.oldpasswordInvalid = false;

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

            $scope.settingsSubmit = function (user) {               
                // check to make sure the form is completely valid
                if ($scope.form.settingsForm.$valid) {
                   Settings.updateUser(user).then(function () {
                       var alertPopup = $ionicPopup.alert({
                           title: 'Done homie!'
                       });
                       alertPopup.then(function (res) {
                           console.log('Done');
                       });
                    });
                }
            };
        }]);
})();