; (function () {
        var app = angular.module('App');
        app.controller('SettingsController', ['$scope', '$ionicPopup', '$timeout', 'UserObject', 'Settings', function ($scope, $ionicPopup, $timeout, UserObject, Settings) {
            
            $scope.user = UserObject.data();  
            $scope.oldpasswordInvalid = false;

            $scope.updatePassword = function () {
                $scope.data = {}
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
              /*  if ($scope.settingsForm.$valid) {
                    Settings.register(user).then(function () {
                        $scope.user = UserObject.data();
                        if ($scope.user.GUID) {
                            $rootScope.username = $scope.user.username;
                            $location.path("/dash");
                        }
                        else {
                            $scope.user = "";
                            $scope.alertNeeded = true;
                        }
                    });
                }
                */
            };
        }]);

    /*
    app.requires.push('ui.bootstrap');

    app.controller('SettingsController', ['$scope', '$location', 'UserObject', '$rootScope', 'Settings', '$modal', function ($scope, $location, UserObject, $rootScope, Settings, $modal) {

        $scope.user = UserObject.data();
        $scope.animationsEnabled = true;
        $scope.alert = null;

        $scope.closeAlert = function () {
            $scope.alertNeeded = false;
        }

        $scope.updatePassword = function () {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    user: function () {
                        return $scope.user;
                    }
                }
            });

            modalInstance.result.then(function (successful) {
                if (successful) {
                    $scope.alert = { type: 'success', msg: updatedUserConst.successfulPassword };
                    $scope.alertNeeded = true;
                }
                else {
                    $scope.alert = { type: 'danger', msg: updatedUserConst.unsuccessfulPassword };
                    $scope.alertNeeded = true;
                }
            }, function () {
                // console.log("Password update canceled");
            });
        }

        // function to submit the form after all validation has occurred
        $scope.settingsSubmit = function (user) {
            // check to make sure the form is completely valid
            if ($scope.settingsForm.$valid) {
                Settings.register(user).then(function () {
                    $scope.user = UserObject.data();
                    if ($scope.user.GUID) {
                        $rootScope.username = $scope.user.username;
                        $location.path("/dash");
                    }
                    else {
                        $scope.user = "";
                        $scope.alert = { type: 'danger', msg: updatedUserConst.unsuccessfulUpdate };
                        $scope.alertNeeded = true;
                    }
                });
            }
        };
    }]);

    app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, user, Settings) {
        $scope.updatePassword = function () {
            if ($scope.passwordForm.$valid) {
                Settings.updatePassword($scope.user.password).then(function () {
                    var successful = Settings.successfulPassword();
                    $modalInstance.close(successful);
                });
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
    */

})();