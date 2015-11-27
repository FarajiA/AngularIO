﻿; (function () {
    var app = angular.module('App');
    app.requires.push('uiGmapgoogle-maps');
    app.controller('UserController', ['$scope', '$q', '$timeout', 'UserObject', '$stateParams', 'Decision', '$location', '$ionicModal', '$interval', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$cordovaGeolocation','$ionicPopup', '$ionicPlatform', 'GeoAlert', 'chaserBroadcast',
        function ($scope, $q, $timeout, UserObject, $stateParams, Decision, $location, $ionicModal, $interval, GoogleMapApi, uiGmapIsReady, $cordovaGeolocation, $ionicPopup, $ionicPlatform, GeoAlert, chaserBroadcast) {

    var userID = $stateParams.userId;
    $scope.imageURL = imageURL;
    var chaserPromise;
    var locationFinished = $q.defer();
    $scope.locationCoordsPromise = locationFinished.promise;

    var yeaUser = UserObject.data();

    var options = {
        timeout: 7000,
        enableHighAccuracy: true,
        maximumAge: 500000
    };

    $scope.userMarker = {
        id: 1,
        options: { icon: 'img/map_dot.png' },
    };

    $scope.doRefresh = function () {
        getUserRequest();
    };
    
    var geoIndex = 0;
    var geoTimer;
    var GeoWatchTimer = function () {
        var d = $q.defer()
        $ionicPlatform.ready(function () {
            $scope.geoWatch = $cordovaGeolocation.watchPosition(options);
            $scope.geoWatch.then(null,
              function (error) {
                  var seen = GeoAlert.getGeoalert();
                  d.resolve();
                  if (seen)
                      return;
                  $ionicPopup.alert({
                      title: mapsPrompt.title,
                      template: mapsPrompt.text
                  }).then(function (res) {
                      GeoAlert.setGeoalert(true);
                  });
              }, function (position) {
                  d.resolve();
                  $scope.userMarker.coords = {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                  };
                  geoIndex++;
              });
        });

        return d.promise;
    };

   var clearGeoWatch = function() {
      if (!_isEmpty($scope.geoWatch))
          $scope.geoWatch.clearWatch();
       if (!_isEmpty($scope.stopCoords))
           $scope.stopCoords();
   };

   var GoogleMapLoad = function () {
       GoogleMapApi.then(function (maps) {
           $scope.options = { disableDefaultUI: true };
           var markerBounds = new maps.LatLngBounds();
           var chaser_Latlng = new maps.LatLng($scope.latitude, $scope.longitude);
           var user_Latlng = new maps.LatLng($scope.userMarker.coords.latitude, $scope.userMarker.coords.longitude);

           markerBounds.extend(chaser_Latlng);


           markerBounds.extend(user_Latlng);
           $scope.map = { control: {}, center: { latitude: markerBounds.getCenter().lat(), longitude: markerBounds.getCenter().lng() }, zoom: 12 };

           uiGmapIsReady.promise().then((function (maps) {
               $scope.map.control.getGMap().fitBounds(markerBounds);
               //$scope.map.control.getGMap().setZoom($scope.map.control.getGMap().getZoom());
           }));
       },
            function (error) {
                $scope.modal.hide();
                $ionicPopup.alert({
                    title: mapsPrompt.Errortitle
                }).then(function (res) {
                });
            });
   };
    

   var getUserRequest = function() {
      UserObject.getUser(userID).then(function() {
      $scope.title = UserObject.details().username;
      $scope.GUID = UserObject.details().GUID;
      $scope.username = UserObject.details().username;
      $scope.firstname = UserObject.details().firstName;
      $scope.lastname = UserObject.details().lastName;
      $scope.noChasers = UserObject.details().noChasers;
      $scope.noChasing = UserObject.details().noChasing;
      $scope.isChasing = $scope.symbol = UserObject.details().isChasing;
      $scope.private = UserObject.details().isprivate;
      $scope.broadcasting = UserObject.details().broadcast;
      $scope.longitude = Number(UserObject.details().longitude);
      $scope.latitude = Number(UserObject.details().latitude);
      $scope.photo = UserObject.details().photo;

      if ($scope.broadcasting) {
          $scope.chaserMarker = {
                id: 0,
                coords: {
                latitude: $scope.latitude,
                longitude: $scope.longitude
           },
          options: { icon: 'img/checkered_chaser.png' },
          };

          if ($scope.user.broadcast) {
              $scope.userMarker.coords = {
              latitude: $scope.user.latitude,
              longitude: $scope.user.longitude
            };
          }
      }
      $scope.$broadcast('scroll.refreshComplete');
    });
   };

   getUserRequest();

var path = $location.path().split("/") || "Unknown";
$scope.segment = path[2];

$ionicModal.fromTemplateUrl('mapModal.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function (modal) {
       $scope.modal = modal;
});

$scope.openModal = function () {
    $scope.modal.show();
    $scope.mapControl = {};
    if ($scope.userMarker.coords)
        GoogleMapLoad();
    else {
        GeoWatchTimer().then(function () {
            GoogleMapLoad();
        });
    }    
};
   
   $scope.closeModal = function () {
       $scope.modal.hide();
   };

   var chaserPromise = function () {
       chaserBroadcast.coords(UserObject.details().GUID).then(function () {
           if (chaserBroadcast.data().broadcast) {
               // elem.attr("data-lat", chaserBroadcast.data().latitude)
               //     .attr("data-long", chaserBroadcast.data().longitude);
               $scope.chaserMarker.coords = {
                   latitude: Number(chaserBroadcast.data().latitude),
                   longitude: Number(chaserBroadcast.data().longitude)
               };
           } else
               $scope.broadcasting = false;
       });
   };

   $scope.$on('$ionicView.enter', function () {
       $scope.interval = $interval(function () { chaserPromise(); }, 30000);
       $scope.stopCoords = function () {
           $interval.cancel($scope.interval);
       };

       $scope.$watch("broadcasting", function(newValue, oldValue) {
           if (newValue) {
               if (!$scope.user.broadcast && ($scope.isChasing === 1 || !$scope.private))
                   GeoWatchTimer();
           }
       });
   });

   $scope.$on('$ionicView.afterLeave', function () {
       clearGeoWatch();
       $scope.stopCoords();
   });

        //Cleanup the modal when we're done with it!
   $scope.$on('$destroy', function () {
       $scope.modal.remove();
   });

   document.addEventListener("pause", function () {
       if (!_isEmpty($scope.geoWatch))
           $scope.geoWatch.clearWatch();
       $scope.stopCoords();
   }, false);

   document.addEventListener("resume", function () {     
       getUserRequest();
       $scope.interval = $interval(function () { chaserPromise(); }, 30000);

       $scope.$watch("broadcasting", function (newValue, oldValue) {
           if (newValue) {
               if (!$scope.user.broadcast && ($scope.isChasing === 1 || !$scope.private))
                   GeoWatchTimer();
           }
       });


   }, false);

  }]);
})();