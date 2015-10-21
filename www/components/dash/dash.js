; (function () {
    var app = angular.module('App');
    app.controller('DashController', ['$scope', 'UserObject', 'Dash', '$cordovaGeolocation', '$ionicPopup','$ionicLoading',
        function ($scope, UserObject, Dash, $cordovaGeolocation, $ionicPopup, $ionicLoading) {

        $ionicLoading.hide()
        $scope.broadcastloading = false;
        $scope.user = UserObject.data();
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
                    $scope.user.broadcast = !(Dash.data() === 0);
                    UserObject.data().broadcast = !(Dash.data() === 0);
                    $scope.$emit('emit_Broadcasting', { action: "turn-off" });
                });
            }
            else {
                $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    $scope.userLat = position.coords.latitude;
                    $scope.userLong = position.coords.longitude;
                    Dash.broadcast($scope.userLat, $scope.userLong, $scope.user.broadcast).then(function () {
                        $ionicLoading.hide();
                        $scope.broadcastloading = false;
                        $scope.user.broadcast = (Dash.data() === 1);
                        UserObject.data().broadcast = (Dash.data() === 1);
                        $scope.$emit('emit_Broadcasting', { action: "turn-on" });
                    });
                }, function (err) {
                    // error
                    $ionicPopup.alert({
                       title: mapsPrompt.title
                    }).then(function (res) {
                        console.log("Location services not on");
                    });  
                });
            }
        }           

        

    }]);
})();