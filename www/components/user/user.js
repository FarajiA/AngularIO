; (function () {
    var app = angular.module('App');
    app.requires.push('uiGmapgoogle-maps');
    app.controller('UserController', ['$scope', 'UserObject', '$stateParams', 'Decision', '$location', '$ionicModal', '$interval', 'uiGmapGoogleMapApi','$cordovaGeolocation','$ionicPopup', '$ionicPlatform', 'GeoAlert',
        function ($scope, UserObject, $stateParams, Decision, $location, $ionicModal, $interval, GoogleMapApi, $cordovaGeolocation, $ionicPopup, $ionicPlatform, GeoAlert) {

            var userID = $stateParams.userId;
            $scope.imageURL = imageURL;

   UserObject.getUser(userID).then(function () {
        $scope.title = UserObject.details().username;
        $scope.GUID = UserObject.details().GUID;
        $scope.username = UserObject.details().username;
        $scope.firstname = UserObject.details().firstname;
        $scope.lastname = UserObject.details().lastname;
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
            }
        } 
         /*
                https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&key=AIzaSyDXOheZlzb8bgjOZKDiyFskCnrl5RV8b_Q
                var map;
                var mapInstance;
                var markers = [];
                var map_long = "";
                var map_lat = "";
                var ch_guid = "";
                var ch_guid_Obj = ""
                var user_image = '../img/map_dot.png';
                var chaser_image = '../img/checkered_chaser.png';
                var map_update = "";
                var user_marker;
                var chaser_marker;
                var markerBounds = "";

                map = new GoogleMap();
                map.initialize();

                var posOptions = { timeout: 10000, enableHighAccuracy: false };
                $scope.getLocation = function () {
                    $cordovaGeolocation
                      .getCurrentPosition(posOptions)
                      .then(function (position) {
                          $scope.userLat = position.coords.latitude
                          $scope.userLong = position.coords.longitude
                      }, function (err) {
                          // error
                          console.log("Position Coordinates error");
                      });
                }


                var watchOptions = {
                    timeout: 3000,
                    enableHighAccuracy: false // may cause errors if true
                };

                var watch = $cordovaGeolocation.watchPosition(watchOptions);
                watch.then(
                  null,
                  function (err) {
                      // error
                      console.log("watch didn't go right");
                  },
                  function (position) {
                      var lat = position.coords.latitude
                      var long = position.coords.longitude
                  });


                watch.clearWatch();


                function GoogleMap() {
                    this.initialize = function () {

                        var chaser_Latlng = new google.maps.LatLng($scope.latitude, $scope.longitude);
                        var user_Latlng = new google.maps.LatLng($scope.userLat, long);
                        var mapOptions = {
                            center: chaser_Latlng,
                            disableDefaultUI: true
                        }

                        mapInstance = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

                        chaser_marker = new google.maps.Marker({
                            position: chaser_Latlng,
                            map: mapInstance,
                            icon: chaser_image
                        });

                        user_marker = new google.maps.Marker({
                            position: user_Latlng,
                            map: mapInstance,
                            icon: user_image
                        });

                        markerBounds = new google.maps.LatLngBounds();
                        markerBounds.extend(chaser_marker.position);
                        markerBounds.extend(user_marker.position);
                        mapInstance.fitBounds(markerBounds);
                        map_update = setInterval(function () { $scope.getLocation(); }, 15000);
                    }

                    this.resetMarkers = function () {
                        deleteMarkers();
                        chaser_Latlng = new google.maps.LatLng(chaserObject.latitude, chaserObject.longitude);
                        user_Latlng = new google.maps.LatLng(lat, long);

                        user_marker.setPosition(user_Latlng);
                        chaser_marker.setPosition(chaser_Latlng);
                        user_marker.setMap(mapInstance);
                        chaser_marker.setMap(mapInstance);

                        
                        markerBounds.extend(chaser_marker.position);
                        markerBounds.extend(user_marker.position);
                        mapInstance.fitBounds(markerBounds);
                       
                    } 
                }



        }
});
 */
});

var path = $location.path().split("/") || "Unknown";
$scope.segment = path[2];


var watchOptions = {
    timeout: 3000,
    enableHighAccuracy: false // may cause errors if true
};

var geo_options = { timeout: 10000, enableHighAccuracy:false };
var posOptions = { maximumAge: 0, timeout: 20000, enableHighAccuracy: false };

//var posOptions = { timeout: 10000, enableHighAccuracy: false, maximumAge: 90000 };

var watch = $cordovaGeolocation.watchPosition(watchOptions);
$ionicModal.fromTemplateUrl('mapModal.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function (modal) {
       $scope.modal = modal;
});
   
   $scope.openModal = function () {
       $scope.modal.show();

       GoogleMapApi.then(function (maps) {
           $scope.map = { center: { latitude: $scope.latitude, longitude: $scope.longitude }, zoom: 12 };
           $scope.options = { disableDefaultUI: true };           ;
           $scope.userMarker = {
               id: 1,
               options: { icon: 'img/map_dot.png' },
           };

       $scope.$watchCollection("chaserMarker.coords", function (newVal, oldVal) {
           if (_.isEqual(newVal, oldVal))
               return;
           $scope.coordsUpdates++;
       });

       $ionicPlatform.ready(function () {
           $cordovaGeolocation
             .getCurrentPosition(posOptions)
             .then(function (position) {
                 $scope.userMarker.coords = {
                     latitude: position.coords.latitude,
                     longitude: position.coords.longitude
                 }

             }, function (err) {
                 // error
                 var seen = GeoAlert.getGeoalert();
                 if (seen) 
                     return 

                     $scope.alertSeen = true;
                     $ionicPopup.alert({
                         title: mapsPrompt.title,
                         template: mapsPrompt.text
                     }).then(function (res) {
                         GeoAlert.setGeoalert(true);
                     });
            
                 console.log("Position Coordinates error");
             });
       });
       
    /*
       function geoLocateSuccess(position) {
           $scope.userLat = position.coords.latitude
           $scope.userLong = position.coords.longitude
           $scope.userMarker = {
               id: 1,
               coords: {
                   latitude: $scope.userLat,
                   longitude: $scope.userLong
               },
               options: { icon: 'img/map_dot.png' },
           };
       }

       function geoLocateError(error) {
           $ionicPopup.alert({
               title: mapsPrompt.title,
               template: mapsPrompt.text + "\n" + error.message
           }).then(function (res) {
               GeoAlert.setGeoalert(true);
           });
           //bootbox.alert("Something went wrong. " + "\n" + error.message);
       }

       if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(geoLocateSuccess, geoLocateError, posOptions);
       } else {
           console.log('not supported');
       }
      /*
      document.addEventListener("deviceready", onDeviceReady, false);    
       
      
           $cordovaGeolocation
                 .getCurrentPosition(posOptions)
                 .then(function (position) {
                     $scope.userLat = position.coords.latitude
                     $scope.userLong = position.coords.longitude

                     $scope.userMarker = {
                         id: 1,
                         coords: {
                             latitude: $scope.userLat,
                             longitude: $scope.userLong
                         },
                         options: { icon: 'img/map_dot.png' },
                     };

                     watch.then(null, function (err) {
                         // error
                         var seen = GeoAlert.getGeoalert();
                         if (seen)
                             return
                         else {
                             $ionicPopup.alert({
                                 title: mapsPrompt.title,
                                 template: mapsPrompt.text
                             }).then(function (res) {
                                 GeoAlert.setGeoalert(true);
                             });
                         }
                     },
                       function (position) {
                           $scope.userMarker = {
                               id: 2,
                               coords: {
                                   latitude: position.coords.latitude,
                                   longitude: position.coords.longitude
                               },
                               options: { icon: 'img/map_dot.png' },
                           };
                       });


                 }, function (err) {
                     // error
                     var seen = GeoAlert.getGeoalert();
                     if (seen) 
                         return 
                     else {
                             $ionicPopup.alert({
                                 title: mapsPrompt.title,
                                 template: mapsPrompt.text
                             }).then(function (res) {
                                 console.log("Done with alert");
                                 GeoAlert.setGeoalert(true);
                             });                      
                     }
                 });
      
          */
   },
function (error) {
      // Do something with the error if it fails
       console.log("Error in Api call");
});      

};
   
   $scope.closeModal = function () {
       $scope.modal.hide();
   };
        //Cleanup the modal when we're done with it!
   $scope.$on('$destroy', function () {
       $scope.modal.remove();
       watch.clearWatch();
   });
        // Execute action on hide modal
   $scope.$on('modal.hidden', function () {
       // Execute action
       console.log("modal hidden");
   });
        // Execute action on remove modal
   $scope.$on('modal.removed', function () {
       // Execute action
       console.log("modal removed");
   });

   }]);
})();