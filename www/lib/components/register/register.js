; (function () {

    var app = angular.module('App');
    app.controller('RegisterController', ['$scope', '$state', 'UserObject', '$ionicLoading', function ($scope, $state, UserObject, $ionicLoading) {
       
        $scope.form = {};
        // function to submit the form after all validation has occurred
        $scope.submitRegister = function (user) {
            // check to make sure the form is completely valid
            if ($scope.form.registerform.$valid) {
               $ionicLoading.show();
               UserObject.register(user).then(function () {
                    $scope.$parent.user = UserObject.data();
                    if ($scope.$parent.user.GUID) {
                        $scope.$parent.photoUpdate();
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