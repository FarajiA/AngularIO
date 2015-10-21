﻿; (function () {

    angular.module('App').controller('LoginController', ['$scope', '$state', 'UserObject','$ionicLoading', function ($scope, $state, UserObject, $ionicLoading) {

        $scope.form = {};
        //function to submit the form after all validation has occurred
        $scope.submitLogin = function (user) {
            $ionicLoading.show();
            if ($scope.form.loginform.$valid) {
                UserObject.login(user).then(function () {
                    $scope.user = UserObject.data();

                    if ($scope.user.GUID) {
                        UserObject.setUser($scope.user.GUID).then(function () {
                            $scope.user = {};
                            $scope.user.username = "";
                            $scope.user.password = "";
                            $scope.form.loginform.$setPristine();
                            $state.go('main.dash');
                        });                        
                    }
                    else {
                       $scope.user = {};
                       alert("No account found");
                    }
                });
            }
        };
    }]);
})();