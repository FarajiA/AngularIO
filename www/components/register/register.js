; (function () {

    var app = angular.module('App');
    app.controller('RegisterController', ['$scope', '$state', 'UserObject', function ($scope, $state, UserObject) {
       
        $scope.form = {};
        // function to submit the form after all validation has occurred
        $scope.submitRegister = function (user) {
            // check to make sure the form is completely valid
            if ($scope.form.registerform.$valid) {
                
               UserObject.register(user).then(function () {
                    $scope.user = UserObject.data();
                    if ($scope.user.GUID) {
                        $state.go('main.dash');
                    }
                    else {
                        $scope.user = "";
                        alert("Something went wrong. Try again!")
                    }
                });
            }
        };
    }]);  
})();