; (function () {

    angular.module('App').controller('LoginController', ['$scope', '$state', 'UserObject', function ($scope, $state, UserObject) {       

        $scope.form = {};
        //function to submit the form after all validation has occurred
        $scope.submitLogin = function (user) {
            if ($scope.form.loginform.$valid) {
                UserObject.login(user).then(function () {
                    $scope.user = UserObject.data();

                    if ($scope.user.GUID) {
                        UserObject.setUser($scope.user.GUID).then(function () {
                            $scope.user = UserObject.data();
                            $state.go('main.dash');
                        });                        
                    }
                    else {
                       $scope.user = "";
                       alert("No account found");
                    }
                });
            }
        };
    }]);
})();