; (function () {
    var app = angular.module('App');
    app.requires.push('uiGmapgoogle-maps');
    app.controller('UserController', ['$scope', 'UserObject', '$stateParams', 'Decision', '$location', '$ionicModal', 'angularLoad', '$timeout','$log',
        function ($scope, UserObject, $stateParams, Decision, $location, $ionicModal, angularLoad, $timeout, $log) {

/*
   var userID = $stateParams.userId;
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
        $scope.longitude = UserObject.details().longitude;
        $scope.latitude = UserObject.details().latitude;

        if ($scope.broadcasting) {
            
        }      

                

   });    
*/
           // angularLoad.loadScript(mapsAPI.url).then(function () {

                $scope.map = { center: { latitude: 40.1451, longitude: -99.6680 }, zoom: 4 };
                $scope.options = { disableDefaultUI: true };
                $scope.coordsUpdates = 0;
                $scope.dynamicMoveCtr = 0;
                $scope.marker = {
                    id: 0,
                    coords: {
                        latitude: 40.1451,
                        longitude: -99.6680
                    },
                    options: { draggable: true },
                    events: {
                        dragend: function (marker, eventName, args) {
                            $log.log('marker dragend');
                            var lat = marker.getPosition().lat();
                            var lon = marker.getPosition().lng();
                            $log.log(lat);
                            $log.log(lon);

                            $scope.marker.options = {
                                draggable: true,
                                labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                                labelAnchor: "100 0",
                                labelClass: "marker-labels"
                            };
                        }
                    }
                };
                $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
                    if (_.isEqual(newVal, oldVal))
                        return;
                    $scope.coordsUpdates++;
                });

                $timeout(function () {
                    $scope.marker.coords = {
                        latitude: 42.1451,
                        longitude: -100.6680
                    };
                    $scope.dynamicMoveCtr++;
                    $timeout(function () {
                        $scope.marker.coords = {
                            latitude: 43.1451,
                            longitude: -102.6680
                        };
                        $scope.dynamicMoveCtr++;
                    }, 2000);
                }, 1000);


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




            }).catch(function () {
                console.log('Couldnt load GMaps');
            });
 */


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
   };
   
   $scope.closeModal = function () {
       $scope.modal.hide();
   };
        //Cleanup the modal when we're done with it!
   $scope.$on('$destroy', function () {
       $scope.modal.remove();
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