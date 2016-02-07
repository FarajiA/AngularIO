; (function () {
    var app = angular.module('App');
    app.controller('DashController', ['$scope', '$cordovaGeolocation', '$ionicPopup','$ionicLoading', 'UserObject', 'Dash',
        function ($scope, $cordovaGeolocation, $ionicPopup, $ionicLoading, UserObject, Dash) {

        $ionicLoading.hide();
        $scope.broadcastloading = false;
        var userStuff = $scope.$parent.user;
        var userParentLogged = $scope.$parent.userLogged;
        var userLogged = $scope.userLogged;
        var posOptions = { timeout: 10000, enableHighAccuracy: false };

        $scope.broadcast = function () {
            $scope.broadcastloading = true;
            $ionicLoading.show({
                content: '<ion-spinner icon="dots" class="spinner-dark"></ion-spinner>',
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 200,
                showDelay: 0
            });
            
            if ($scope.user.broadcast) {
                Dash.broadcast('0', '0', $scope.user.broadcast).then(function () {
                    $scope.broadcastloading = false;
                    $ionicLoading.hide();
                    $scope.user.broadcast = (Dash.data() === 1);
                    $scope.$emit('emit_Broadcasting', { action: "turn-off" });
                });
            }
            else {
                $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    $scope.user.latitude = position.coords.latitude;
                    $scope.user.longitude = position.coords.longitude;
                    Dash.broadcast($scope.user.latitude, $scope.user.longitude, $scope.user.broadcast).then(function () {
                        $ionicLoading.hide();
                        $scope.broadcastloading = false;
                        $scope.user.broadcast = (Dash.data() === 1);
                        $scope.$emit('emit_Broadcasting', { action: "turn-on" });
                    });
                }, function (err) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                       title: mapsPrompt.title
                    }).then(function (res) {
                        //console.log("Location services not on");
                    });  
                });
            }
        }           

        

    }]);
})();