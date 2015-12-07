; (function () {

    angular.module('App').controller('LoginController', ['$scope', '$state', 'UserObject','$ionicLoading', function ($scope, $state, UserObject, $ionicLoading) {
        
        $scope.form = {};
        $scope.showLoginForm = false;
        //function to submit the form after all validation has occurred
        $scope.submitLogin = function (user) {
            if ($scope.form.loginform.$valid) {
                $ionicLoading.show();
                UserObject.login(user).then(function () {
                    if (UserObject.data().GUID) {
                        UserObject.setUser(UserObject.data().GUID).then(function () {
                            $scope.$parent.user = UserObject.data();
                            $scope.$parent.photoUpdate();
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
    }]);
})();