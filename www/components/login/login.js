; (function () {

    angular.module('App').controller('LoginController', ['$scope', '$state', 'UserObject','$ionicLoading', function ($scope, $state, UserObject, $ionicLoading) {
        
        $scope.form = {};
        $scope.showLoginForm = true;
        $scope.submitLogin = function (user) {
            if ($scope.form.loginform.$valid) {
                $ionicLoading.show();
                UserObject.login(user).then(function () {
                    if (UserObject.data().GUID) {
                        UserObject.setUser(UserObject.data().GUID).then(function () {
                            $scope.user = UserObject.data();
                            $scope.$parent.photoUpdate($scope.user);
                            if ($scope.user.broadcast) {
                                $scope.$emit('emit_Broadcasting', { action: "turn-on" });
                            }
                            $state.go('main.dash');
                        });                        
                    }
                    else {
                       $ionicLoading.hide();
                       $scope.user = {};
                       alert("No account found");
                    }
                });
            }
        };

        $scope.submitRegister = function (user) {
            // check to make sure the form is completely valid
            if ($scope.form.registerform.$valid) {
                $ionicLoading.show();
                UserObject.register(user).then(function () {
                    $scope.user = UserObject.data();
                    if ($scope.user.GUID) {
                        $scope.$parent.photoUpdate($scope.user);
                        $state.go('main.dash');
                    }
                    else {
                        $ionicLoading.hide();
                        alert("Something went wrong. Try again!");
                    }
                });
            }
        };









    }]);
})();