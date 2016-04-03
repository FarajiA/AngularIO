; (function () {
    var app = angular.module('App');
    app.requires.push('uiGmapgoogle-maps');
    app.controller('UserController', ['$scope','$rootScope', '$q', '$timeout', 'UserObject', '$stateParams', 'Decision', '$location', '$ionicModal', '$interval', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$cordovaGeolocation', '$ionicPopup', '$ionicPopover', '$ionicPlatform', '$ionicLoading', 'GeoAlert', 'chaserBroadcast', 'UserView', 'Report','Block',
    function ($scope,$rootScope, $q, $timeout, UserObject, $stateParams, Decision, $location, $ionicModal, $interval, GoogleMapApi, uiGmapIsReady, $cordovaGeolocation, $ionicPopup, $ionicPopover, $ionicPlatform, $ionicLoading, GeoAlert, chaserBroadcast, UserView, Report, Block) {
        
        var userID = $stateParams.userId;
        $scope.imageURL = imageURL;
        var chaserPromise;

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

        $scope.alreadyBlocked = false;

        var geoIndex = 0;
        var geoTimer;
        var GeoWatchTimer = function () {
            var d = $q.defer()
            $ionicPlatform.ready(function() {
                $scope.geoWatch = $cordovaGeolocation.watchPosition(options);
                $scope.geoWatch.then(null,
                  function (error) {
                      d.resolve();
                      var seen = GeoAlert.getGeoalert();
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
                      $scope.user.latitude = position.coords.latitude;
                      $scope.user.longitude = position.coords.longitude;
                      $scope.userMarker.coords = {
                          latitude: $scope.user.latitude,
                          longitude: $scope.user.longitude
                      };
                  });
            });
            return d.promise;
        };

        var clearGeoWatch = function () {
            if (!_isEmpty($scope.geoWatch))
                $scope.geoWatch.clearWatch();
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

                uiGmapIsReady.promise().then(function (maps) {
                    $scope.map.control.getGMap().fitBounds(markerBounds);
                    //$scope.map.control.getGMap().setZoom($scope.map.control.getGMap().getZoom());
                });
            },
            function (error) {
                $scope.modal.hide();
                $ionicPopup.alert({
                    title: mapsPrompt.Errortitle
                }).then(function (res) {
                });
            });
        };

        var getUserRequest = function () {
            UserObject.getUser(userID).then(function () {
                $scope.title = UserObject.details().username;
                $scope.GUID = UserObject.details().GUID;
                $scope.username = UserObject.details().username;
                $scope.firstname = UserObject.details().firstname;
                $scope.lastname = UserObject.details().lastname;
                $scope.noChasers = UserObject.details().noChasers;
                $scope.noChasing = UserObject.details().noChasing;                
                $scope.private = UserObject.details().isprivate;
                $scope.broadcasting = UserObject.details().broadcast;
                $scope.longitude = Number(UserObject.details().longitude);
                $scope.latitude = Number(UserObject.details().latitude);
                $scope.photo = UserObject.details().photo;
                /*
                Report.Flagged($scope.GUID, UserObject.data().GUID).then(function (response) {                    
                    $scope.alreadyReported = (response.ID > 0);
                });
                */

                Block.blockExists($scope.GUID).then(function (response) {
                    UserObject.setBlocked(response.ID > 0);
                    if (response.ID > 0) {
                        $scope.isChasing = $scope.symbol = 3;
                        $scope.blockText = activityConst.unblock;
                    }
                    else {
                        $scope.isChasing = $scope.symbol = UserObject.details().isChasing;
                        $scope.blockText = activityConst.block;
                    }
                });

                $ionicLoading.hide();
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
            GoogleMapLoad();
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        var chaserPromise = function () {
            chaserBroadcast.coords(UserObject.details().GUID).then(function () {
                if (chaserBroadcast.data().broadcast) {
                    $scope.broadcasting = true;
                    $scope.chaserMarker.coords = {
                        latitude: Number(chaserBroadcast.data().latitude),
                        longitude: Number(chaserBroadcast.data().longitude)
                    };
                } else {
                    $scope.broadcasting = false;
                    if ($scope.modal.isShown()) {
                        $ionicPopup.alert({
                            template: mapsPrompt.NolongerBroadcasting
                        }).then(function (res) {
                            $scope.modal.hide();
                        });
                    }
                }
            });
        };

        $scope.$on('$ionicView.enter', function () {
            if (!(userID === UserObject.data().GUID)) {
                $scope.chaserLink = '#/main/' + $scope.segment + '/chasers/' + $scope.GUID;
                $scope.chasingLink = '#/main/' + $scope.segment + '/chasing/' + $scope.GUID;
                $scope.stopCoords = function () {
                    $interval.cancel($scope.interval);
                };

                $scope.$watch("broadcasting", function (newValue, oldValue) {
                    if (newValue) {
                        if (!$scope.user.broadcast && ($scope.isChasing === 1 || !$scope.private)) {
                            geoIndex = 0;
                            GeoWatchTimer().then(function () {
                                $scope.chaserMarker = {
                                    id: 0,
                                    coords: {
                                        latitude: $scope.latitude,
                                        longitude: $scope.longitude
                                    },
                                    options: { icon: 'img/checkered_chaser.png' },
                                };
                            });
                        }
                        else {
                            $scope.chaserMarker = {
                                id: 0,
                                coords: {
                                    latitude: $scope.latitude,
                                    longitude: $scope.longitude
                                },
                                options: { icon: 'img/checkered_chaser.png' },
                            };
                            $scope.userMarker.coords = {
                                latitude: $scope.user.latitude,
                                longitude: $scope.user.longitude
                            };
                        }
                        $scope.stopCoords();
                        $scope.interval = $interval(function () { chaserPromise(); }, 15000);
                    }
                    else {
                        $scope.stopCoords();
                        $scope.interval = $interval(function () { chaserPromise(); }, 30000);
                    }
                });
            }
            else {
                $scope.chaserLink = $scope.chasingLink = '#/main/traffic';
                $scope.selfIdentity = true;
                if ($scope.user.broadcast) {
                    $scope.stopCoords = function () {
                        $interval.cancel($scope.interval);
                    };
                    GeoWatchTimer();
                }
            }

            var shouldGeolocate = ($scope.isChasing === 1 || !$scope.private);
            UserView.SetUserPageCurrent(shouldGeolocate);
        });

        $scope.$on('$ionicView.leave', function () {
            if (!$scope.selfIdentity) {
                clearGeoWatch();
                UserView.SetUserPageCurrent(false);
            }
        });

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        $scope.$on('turnOn_locationWatch', function (event, args) {
            if (args.action === "turn-on") {
                getUserRequest();
                $scope.$watch("broadcasting", function (newValue, oldValue) {
                    if (newValue) {
                        if (!$scope.user.broadcast && ($scope.isChasing === 1 || !$scope.private)) {
                           // if ($scope.modal.isShown())
                                GeoWatchTimer();
                        }
                        else {
                            $scope.chaserMarker = {
                                id: 0,
                                coords: {
                                    latitude: $scope.latitude,
                                    longitude: $scope.longitude
                                },
                                options: { icon: 'img/checkered_chaser.png' },
                            };
                            $scope.userMarker.coords = {
                                latitude: $scope.user.latitude,
                                longitude: $scope.user.longitude
                            };
                        }
                        $scope.stopCoords();
                        $scope.interval = $interval(function () { chaserPromise(); }, 15000);
                    }
                });
            }
            if (args.action === "turn-off") {
                geoIndex = 0;
                clearGeoWatch();
            }
        });

        $ionicPopover.fromTemplateUrl('menuPopover.html', {
            scope: $scope,
        }).then(function (popover) {
            $scope.popover = popover;

        $scope.flagUser = function () {
                $scope.popover.hide();

        var reportPopup = $ionicPopup.show({
            templateUrl: 'components/user/report-modal.html',
            cssClass: 'reportUserPopup',
            title: 'Report',
            scope: $scope,
            buttons: [
              { text: 'Cancel' },
              {
                  text: '<b>Report</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                      $ionicLoading.show();
                      var reportResponse;
                      var selected = $scope.selectedReportValue
                      Report.Flag($scope.GUID, UserObject.data().GUID, selected).then(function (response) {
                          $ionicLoading.hide();
                          if (response.ID > 0) {
                              reportPopup.close();
                              var alertPopup = $ionicPopup.alert({
                                  title: ReportingConst.flaggedTitle.replace(/0/gi, $scope.username),
                                  template: ReportingConst.flaggedText
                              });
                          }
                          else {
                              reportPopup.close();
                              var alertPopup = $ionicPopup.alert({
                                  title: 'Whoops!',
                                  template: updatedUserConst.unsuccessfulUpdate
                              });
                          }
                      }, function () {
                          $ionicLoading.hide();
                      }).finally(function () {
                          $ionicLoading.hide();
                      });
                  }
              }
            ]
        });
      };

        $scope.blockAction = function () {
            $scope.popover.hide();
            if (UserObject.getBlocked()) {
                $timeout(function () {
                    angular.element(document.querySelector('#btnDecision')).triggerHandler('click');
                }, 100);
            }
            else {
                var blockPopup = $ionicPopup.show({
                    title: BlockConst.blockedConfirmTitle,
                    buttons: [
                        {
                            text: 'Cancel'
                        },
                        {
                            text: '<b>Sure</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                Block.block($scope.GUID).then(function (response) {
                                    $ionicLoading.hide();
                                    if (response.ID > 0) {
                                        blockPopup.close();
                                        var alertPopup = $ionicPopup.alert({
                                            title: BlockConst.blockedCompletedTitle.replace(/0/gi, $scope.username),
                                            template: BlockConst.blockedCompletedText
                                        });

                                        alertPopup.then(function (res) {
                                            $scope.$emit('emit_Chasers_Block', { action: true });
                                        });

                                        $scope.$emit('emit_Activity', { action: true });
                                        

                                        getUserRequest();
                                    }
                                    else {
                                        blockPopup.close();
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Oops!',
                                            template: updatedUserConst.unsuccessfulUpdate
                                        });
                                    }
                                });
                            }
                        }
                    ]
                });
            }
        };
     });

        $scope.FlagOptions = [
            { text: "Inappropriate image", value: "img" },
            { text: "Username or Name", value: "name" },
            { text: "Being an idiot", value: "idiot" },
            { text: "All the above", value: "all" }
        ];

        $scope.ReportChange = function (item) {
            $scope.selectedReportValue = item.value;
        };

        $scope.reportdata = {
            option: 'img'
        };
        
    }]);
})();