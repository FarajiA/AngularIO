﻿; (function () {
    angular.module('App').directive('userChoice', ['UserObject', 'Decision', function (UserObject, Decision) {
        return {
            restrict: 'A',
            require:'?ngModel',
            link: function (scope, elem, attrs, ctrl) {

                var UserRequest = function () {
                        scope.$apply(function () {
                            Decision.request(UserObject.details().GUID).then(function () {
                                if (Decision.data() === 1) {
                                    elem.attr('data-chasing', "requested").attr("disabled", "disabled");
                                    scope.symbol = 2;
                                }
                            });
                        });
                };

                var UserFollow = function () {
                        scope.$apply(function () {
                            Decision.follow(UserObject.details().GUID).then(function () {
                                if (Decision.data() === 1) {
                                    elem.attr('data-chasing', true);
                                    UserObject.details().isChasing = true;
                                    scope.noChasers++;
                                    scope.symbol = 1;
                                    scope.$emit('emit_Chasers', { action: "chasing" });
                                }
                            });
                        });
                    };

                var UserUnfollow = function () {
                    scope.$apply(function () {
                        Decision.unfollow(UserObject.details().GUID).then(function () {
                            if (Decision.data() === 1) {
                                elem.attr('data-chasing', false);
                                UserObject.details().isChasing = false;
                                scope.noChasers--;
                                scope.symbol = 0;
                                scope.$emit('emit_Chasers', { action: "chasing" });
                            }
                        });
                    });
                };

                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    if (newValue >= 0 && newValue < 3) {
                        scope.loadingFollow = false;
                    }
                        switch (newValue) {
                            case 0:
                                elem.attr('data-chasing', false);
                                scope.isFollowing = activityConst.follow;
                                break;
                            case 1:
                                elem.attr('data-chasing', true);
                                scope.isFollowing = activityConst.following;
                                break;
                            case 2:
                                elem.attr('data-chasing', "requested").attr("disabled", "disabled");
                                scope.isFollowing = activityConst.requested;
                                break;
                        }
                });

                elem.on('click', function (e) {
                    scope.$apply(function () {
                        scope.symbol = 3;
                        scope.loadingFollow = true;
                    });
                 
                    if (UserObject.details().isprivate && UserObject.details().isChasing == 0)
                        UserRequest();
                    else if (!UserObject.details().isprivate && UserObject.details().isChasing == 1)
                        UserUnfollow();
                    else 
                        UserFollow();
                      
                });
            }
        }
    }]);

    angular.module('App').directive('userBroadcast', ['UserObject', 'chaserBroadcast', '$interval', function (UserObject, chaserBroadcast, $interval) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elem, attrs, ctrl) {
                scope.interval;
                var promise;
                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    if (newValue) {
                        if (UserObject.details().isChasing == 1 || !UserObject.details().isprivate) {
                            elem.removeAttr("disabled")
                            .attr("data-lat", UserObject.details().latitude)
                            .attr("data-long", UserObject.details().longitude)
                            .text(userDetails.viewlocation)
                            .removeClass("ion-locked");
                        }
                        else if (UserObject.details().isprivate) {
                            elem.attr("disabled", "disabled")
                            .text(userDetails.broadcasting)
                            .addClass("ion-locked");
                        }
                        /*
                        promise = function() {
                            chaserBroadcast.coords(UserObject.details().GUID).then(function() {
                                if (chaserBroadcast.data().broadcast) {
                                    elem.attr("data-lat", chaserBroadcast.data().latitude)
                                        .attr("data-long", chaserBroadcast.data().longitude);
                                    scope.chaserMarker.coords = {
                                        latitude: Number(chaserBroadcast.data().latitude),
                                        longitude: Number(chaserBroadcast.data().longitude)
                                    };
                                } else {
                                    scope.$apply(function() {
                                        scope.broadcasting = false;
                                    });
                                }
                            });
                        };

                        scope.interval = $interval(function () { promise(); }, 30000);

                        scope.stopCoords = function () {
                            if (!_isEmpty(scope.interval) && scope.interval)
                                $interval.cancel(scope.interval);
                        };
                        */
                    }
                    else {
                        elem.attr("disabled", "disabled")
                        .text(userDetails.notBroadcasting);
                    }
                });


                /*
                scope.$on('$ionicView.leave', function () {
                    scope.stopCoords();
                });

                document.addEventListener("pause", function () {
                    scope.stopCoords();
                }, false);


                scope.$on('$destroy', function (event) {
                    scope.stopCoords();
                });
                */
            }
        }
    }]);

})();