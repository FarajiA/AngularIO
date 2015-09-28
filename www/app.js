var baseURL = "http://localhost:3536/";
var countSet = 10;
var activityConst = {
    following: 'Following',
    follow: 'Follow',
    requested: 'Requested'
}
var updatedUserConst = {
    successfulPassword: 'Password Updated!',
    unsuccessfulPassword: 'Oops Password not updated!',
    successfulUpdate: 'Account Updated!',
    emailInUse: 'Email is already registered.',
    unsuccessfulUpdate: 'Something went wrong. Try again!'
}

var deleteUserConst = {
    removeUserTitle: 'remove chaser?',
    successfullyDeleted: '0 is no longer chasing you.',
    notsuccessfullyDeleted: 'Oops something fubbed!'
}
var requestConst = {
    acceptRequest: 'Accept',
    declineRequest: 'Decline',
    acceptRequestMsg: 'Allow 0 to chase you?',
    declineRequestMsg: "Reject 0's request?",
    acceptRequestSuccess: '0 accepted',
    declineRequestSuccess: '0 declined'
}
var userDetails = {
    broadcasting: 'Broadcasting',
    viewlocation: 'View location',
    notBroadcasting: 'Not broadcasting'
}
var mapsAPI = {
    url: '//maps.googleapis.com/maps/api/js?v=3&sensor=true'
}

var mapsPrompt = {
    title: 'Location services off',
    text: 'To see your position turn on location services',
    error: 'Location services off'
}

; (function () {
var app = angular.module('App', [
                'oc.lazyLoad',
                'ionic',
                'LocalStorageModule',
                'ngCordova'
]);

app.run(function ($ionicPlatform, $ionicSideMenuDelegate, $rootScope, UserObject, $state, $q) {
   
    $ionicPlatform.ready(function () {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
    });
    
    $rootScope.$on('emit_Chasers', function (event, args) {
        $rootScope.$broadcast('update_Chasers', args);
    });

    $rootScope.$on('emit_Broadcasting', function (event, args) {
        $rootScope.$broadcast('update_location', args);
    });

    UserObject.fillAuthData();

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            var authdata = UserObject.authentication();
            var auth = authdata.isAuth;
            var guid = authdata.guid;
            var userGuid = UserObject.data().GUID;

            if ($rootScope.stateChangeBypass || toState.name === 'login' || toState.name == 'register') {
                $rootScope.stateChangeBypass = false;
                return;
            }
            
            event.preventDefault();

            if (auth && userGuid) {
                $rootScope.stateChangeBypass = true;
                $state.go(toState, toParams);
            }
            else if (auth && !userGuid) {
                UserObject.setUser(guid).then(function () {
                    $rootScope.stateChangeBypass = true;
                    $state.go(toState.name);                    
                });
            }
            else {
                $state.go('login')
            }
      });
});

app.config(RouteMethods, ocLazyLoadProvider);
RouteMethods.$inject = ["$stateProvider","$urlRouterProvider","$ionicConfigProvider"];
ocLazyLoadProvider.$inject = ["$ocLazyLoadProvider"];

function RouteMethods($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    
    $ionicConfigProvider.backButton.text('');

    // setup an abstract state for the tabs directive
    $stateProvider.state('main', {
        url: '/main',
        templateUrl: 'components/layout/main.html',
        abstract: true
    })
    // Each tab has its own nav history stack:
    .state('main.dash', {
        url: '/dash',
        views: {
            'main-dash': {
                templateUrl: 'components/dash/dash.html',
                controller: 'DashController'
            }
        },
        resolve: {
            loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'dash',
                    files: [
                        'components/dash/dash.js'
                    ]
                });
            }],
            data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                $ionicSideMenuDelegate.canDragContent(true);
            }]
        }
    })
        .state('main.traffic', {
            url: '/traffic',
            views: {
                'main-traffic': {
                    templateUrl: 'components/traffic/traffic.html',
                    controller: 'TrafficController'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'traffic',
                        files: [
                            'components/traffic/trafficServices.js',
                            'components/traffic/traffic.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(true);
                }]
            }
        })
        .state('main.traffic-detail', {
            url: '/traffic/:userId',
            views: {
                'main-traffic': {
                    templateUrl: 'components/user/user.html',
                    controller: 'UserController'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'trafficDetails',
                        files: [
                            'lib/lodash.underscore.js',
                            'lib/angular-simple-logger.js',
                            'lib/angular-google-maps.js',
                            'components/user/userServices.js',
                            'components/user/user.js',
                            'components/user/userDirectives.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
        .state('main.traffic-chasers', {
            url: '/traffic/chasers/:userId',
            views: {
                'main-traffic': {
                    templateUrl: 'components/chasers/chasers.html',
                    controller: 'ChasersController'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'trafficChasers',
                        files: [
                            'components/chasers/chaserServices.js',
                            'components/chasers/chasers.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
        .state('main.traffic-chasing', {
            url: '/traffic/chasing/:userId',
            views: {
                'main-traffic': {
                    templateUrl: 'components/chasing/chasing.html',
                    controller: 'ChasingController'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'trafficChasing',
                        files: [
                            'components/chasing/chasingServices.js',
                            'components/chasing/chasing.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
        .state('main.activity', {
            url: '/activity',
            views: {
                'main-activity': {
                    templateUrl: 'components/activity/activity.html',
                    controller: 'ActivityController'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'activity',
                        files: [
                            'components/activity/activityServices.js',
                            'components/activity/activity.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(true);
                }]
            }
        })
        .state('main.activity-detail', {
            url: '/activity/:userId',
            views: {
                'main-activity': {
                    templateUrl: 'components/user/user.html',
                    controller: 'UserController'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'activityDetails',
                        files: [
                            'lib/lodash.underscore.js',
                            'lib/angular-simple-logger.js',
                            'lib/angular-google-maps.js',
                            'components/user/userServices.js',
                            'components/user/user.js',
                            'components/user/userDirectives.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
        .state('main.activity-chasers', {
            url: '/activity/chasers/:userId',
            views: {
                'main-activity': {
                    templateUrl: 'components/chasers/chasers.html',
                    controller: 'ChasersController'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'activityDetails',
                        files: [
                            'components/chasers/chaserServices.js',
                            'components/chasers/chasers.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
        .state('main.activity-chasing', {
            url: '/activity/chasing/:userId',
            views: {
                'main-activity': {
                    templateUrl: 'components/chasing/chasing.html',
                    controller: 'ChasingController'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'activityDetails',
                        files: [
                            'components/chasing/chasingServices.js',
                            'components/chasing/chasing.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
        .state('main.search', {
            url: '/search',
            views: {
                'main-search': {
                    templateUrl: 'components/search/search.html',
                    controller: 'SearchController'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'search',
                        files: [
                            'components/search/searchServices.js',
                            'components/search/search.js',
                            'components/search/searchDirectives.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(true);
                }]
            }
        })
        .state('main.search-detail', {
            url: '/search/:userId',
            views: {
                'main-search': {
                    templateUrl: 'components/user/user.html',
                    controller: 'UserController'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'searchDetails',
                        files: [
                            'lib/lodash.underscore.js',
                            'lib/angular-simple-logger.js',
                            'lib/angular-google-maps.js',
                            'components/user/userServices.js',
                            'components/user/user.js',
                            'components/user/userDirectives.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
        .state('main.search-chasers', {
            url: '/search/chasers/:userId',
            views: {
                'main-search': {
                    templateUrl: 'components/chasers/chasers.html',
                    controller: 'ChasersController'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'searchChasers',
                        files: [
                            'components/chasers/chaserServices.js',
                            'components/chasers/chasers.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
        .state('main.search-chasing', {
            url: '/search/chasing/:userId',
            views: {
                'main-search': {
                    templateUrl: 'components/chasing/chasing.html',
                    controller: 'ChasingController'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'searchChasing',
                        files: [
                            'components/chasing/chasingServices.js',
                            'components/chasing/chasing.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
  .state('settings', {
      url: '/settings',
      templateUrl: 'components/settings/settings.html',
      controller: 'SettingsController',
      resolve: {
          loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load({
                  name: 'settings',
                  files: [
                      'lib/angular-messages.js',
                      'components/settings/settingsServices.js',
                      'components/settings/settingsDirectives.js',
                      'components/settings/settings.js',
                  ]
              });
          }],
          data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
              $ionicSideMenuDelegate.canDragContent(false);
          }]
      }
  })
  .state('contacts', {
      url: '/contacts',
      templateUrl: 'components/contacts/contacts.html',
      controller: 'ContactsController',
      resolve: {
          loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load({
                  name: 'contacts',
                  files: [
                      'components/contacts/contacts.js'
                  ]
              });
          }],
          data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
              $ionicSideMenuDelegate.canDragContent(false);
          }]
      }
  })
  .state('login', {
      url: '/login',
      templateUrl: 'components/login/login.html',
      controller: 'LoginController',
      resolve: {
          loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load({
                  name: 'login',
                  files: [
                      'components/login/login.js'
                  ]
              });
          }],
          data: ['$ionicSideMenuDelegate', function($ionicSideMenuDelegate) {
              $ionicSideMenuDelegate.canDragContent(false);
          }]
      }
  })
  .state('register', {
      url: '/register',
      templateUrl: 'components/register/register.html',
      controller: 'RegisterController',
      resolve: {
          loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
              return $ocLazyLoad.load({
                  name: 'register',
                  files: [
                      'lib/angular-messages.js',
                      'components/register/registrationServices.js',
                      'components/register/register.js',
                      'components/register/registrationDirectives.js'
                  ]
              });
          }],
          data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
              $ionicSideMenuDelegate.canDragContent(false);
          }]
      }
  });

  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get("$state");
        $state.go("main.dash");
    });
};

function ocLazyLoadProvider($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: true,
        asyncLoader: $script
    });
}

/************ Factory Services ***********/
// Store and Process User data
app.factory('UserObject', ['$http', '$q', 'localStorageService', '$rootScope', function ($http, $q, localStorageService,$rootScope) {
    var data = [];
    var detailedUser = [];
    var UserObject = {};

    var _authentication = function() {
        var authData = localStorageService.get('authorizationData');
        var authObject = {}
        if (authData) {
            authObject.isAuth = true;
            authObject.guid = authData.chaserID;
            $rootScope.username = authObject.userName = authData.chaseruser;
            authObject.password = authData.chasrpsswd;
        }
        else {
            authObject.isAuth = false;
            authObject.userName = "";
            authObject.password = "";
        }        
        return authObject;
    };

    var _fillAuthData = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.guid = authData.chaserID;
            _authentication.userName = authData.userName;           
        }
    };

    UserObject.login = function (user) {
        var deffered = $q.defer();
        var msg = { "username": user.username, "password": user.password };
        $http.post(baseURL + "api/login", msg)
        .success(function (d) {
            data = d;
            if (data.passwd !== "0" && data.username !== "0") {
                localStorageService.set('authorizationData', { chaserID: data.GUID, chaseruser: data.username, chasrpsswd: user.password });
                _authentication.isAuth = true;
                _authentication.userName = data.username;
                _authentication.userName = user.password;
            }
            deffered.resolve();
        })
        .error(function (data, status) {
            console.log("Request failed " + status);
        });
        return deffered.promise;
    };

    UserObject.setUser = function (guid) {
        var deffered = $q.defer();
        $http.get(baseURL + "api/user/" + guid)
        .success(function (d) {
            data = d;
            deffered.resolve();
        })
        .error(function (data, status) {
            console.log("Request failed " + status);
        });
        return deffered.promise;
    };

    UserObject.register = function (user) {
        var deffered = $q.defer();
        var msg = { "firstName": user.firstname, "lastName": user.lastname, "emailAddress": user.email, "username": user.username, "passwd": user.passwordConfirm };
        $http.post(baseURL + "api/register", msg)
        .success(function (d) {
            data = d;
            if (data.passwd !== "0" && data.username !== "0") {
                localStorageService.set('authorizationData', { chaserID: data.GUID, chaseruser: user.username, chasrpsswd: user.password });
                _authentication.isAuth = true;
                _authentication.userName = data.username;
                _authentication.userName = user.password;
            }
            deffered.resolve();
        })
        .error(function (data, status) {
            console.log("Request failed " + status);
        });
        return deffered.promise;
    };

    UserObject.getUser = function (guid) {
        var deffered = $q.defer();
        $http.get(baseURL + "api/user/" + guid + "/" + this.data().GUID)
        .success(function (d) {
            detailedUser = d;
            deffered.resolve();
        })
        .error(function (data, status) {
            console.log("Request failed " + status);
        });
        return deffered.promise;
    };
    
    UserObject.details = function () { return detailedUser; }
    UserObject.data = function () { return data; };
    UserObject.authentication = _authentication;
    UserObject.fillAuthData = _fillAuthData;
    return UserObject;
}]);

app.factory('Dash', ['$http', '$q', 'UserObject', function ($http, $q, UserObject) {
    var data = [];
    var User = {};

    User.broadcast = function (lat, long, on) {
        var deffered = $q.defer();
        var guid = UserObject.data().GUID;
        var msg = { "GUID": guid, "latitude": lat, "longitude": long, "on": on };

        $http.put(baseURL + "api/users/broadcast/", msg)
        .success(function (d) {
            data = d;
            deffered.resolve();
        })
        .error(function (data, status) {
            console.log("Request failed " + status);
        });
        return deffered.promise;
    };

    User.data = function () { return data };
    return User;
}]);
    

/************ init ****************/
    app.controller('initController', ['$scope', 'UserObject', '$rootScope','$cordovaCamera', '$cordovaFileTransfer', '$ionicModal', 'Dash', function ($scope, UserObject, $rootScope, $cordovaCamera, $cordovaFileTransfer,$ionicModal, Dash) {
        
    $ionicModal.fromTemplateUrl('photo-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.$on('update_location', function (event, args) {
        if (args.action === "turn-on") {
            console.log("Watch Coords here");
        }
        else if (args.action === "turn-off") {
            console.log("Turn off");
        }                
    });    
    /*
    var params = new Object();
    params.headers = { Authorization: log_cred };
    options.params = params;
    */
    $scope.openModal = function () {
        $scope.modal.show();
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.data = { "ImageURI": "Select Image" };
    $scope.takePicture = function () {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URL,
            sourceType: Camera.PictureSourceType.CAMERA
        };
        $cordovaCamera.getPicture(options).then(
          function (imageData) {
              $scope.picData = imageData;
              $scope.ftLoad = true;
              $localstorage.set('fotoUp', imageData);
              $ionicLoading.show({ template: 'Foto acquisita...', duration: 500 });
          },
          function (err) {
              $ionicLoading.show({ template: 'Errore di caricamento...', duration: 500 });
          })
    }

    $scope.selectPicture = function () {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        };

        $cordovaCamera.getPicture(options).then(
          function (imageURI) {
              window.resolveLocalFileSystemURI(imageURI, function (fileEntry) {
                  $scope.picData = fileEntry.nativeURL;
                  $scope.ftLoad = true;
                  var image = document.getElementById('myImage');
                  image.src = fileEntry.nativeURL;
              });
              $ionicLoading.show({ template: 'Foto acquisita...', duration: 500 });
          },
          function (err) {
              $ionicLoading.show({ template: 'Errore di caricamento...', duration: 500 });
          })
    };

    $scope.uploadPicture = function () {
        $ionicLoading.show({ template: 'Sto inviando la foto...' });
        var fileURL = $scope.picData;
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.chunkedMode = true;

        var params = {};
        params.value1 = "someparams";
        params.value2 = "otherparams";

        options.params = params;

        var ft = new FileTransfer();
        ft.upload(fileURL, encodeURI("http://www.yourdomain.com/upload.php"), viewUploadedPictures, function (error) {
            $ionicLoading.show({ template: 'Errore di connessione...' });
            $ionicLoading.hide();
        }, options);
    }


    /*
    $scope.takephoto = function () {

    }

    $scope.uploadPhoto = function () {

    }
    */



}]);


})();
