; (function () {
    angular.module('App').directive('userChoice', ['UserObject', 'Decision', '$rootScope', function (UserObject, Decision, $rootScope) {
        return {
            restrict: 'A',
            require:'?ngModel',
            link: function (scope, elem, attrs, ctrl) {

                var UserRequest = function () {
                        scope.$apply(function () {
                            Decision.request(UserObject.details().GUID).then(function () {
                                if (Decision.data() === 1) {
                                    elem.attr('data-chasing', "requested").attr("disabled", "disabled");
                                    scope.isFollowing = activityConst.requested;
                                    scope.notChasing = false;
                                    scope.requested = true;
                                }
                            });
                        });
                };

                var UserFollow = function () {
                        scope.$apply(function () {
                            Decision.follow(UserObject.details().GUID).then(function () {
                                if (Decision.data() === 1) {
                                    elem.attr('data-chasing', true);
                                    scope.isFollowing = activityConst.following;
                                    UserObject.details().isChasing = true;
                                    scope.noChasers++;
                                    //$rootScope.followingNo++;
                                    scope.notChasing = false;
                                    scope.yesChasing = true;
                                }
                            });
                        });
                    };

                var UserUnfollow = function () {
                    scope.$apply(function () {
                        Decision.unfollow(UserObject.details().GUID).then(function () {
                            if (Decision.data() === 1) {
                                elem.attr('data-chasing', false);
                                scope.isFollowing = activityConst.follow;
                                UserObject.details().isChasing = false;
                                scope.noChasers--;
                                //$rootScope.followingNo--;
                                scope.notChasing = true;
                                scope.yesChasing = false;
                            }
                        });
                    });
                };

                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
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
                var interval;
                var promise;
                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    if (newValue) {
                        if (UserObject.details().isChasing == 1 || !UserObject.details().isprivate) {
                            elem.removeAttr("disabled")
                            .attr("data-lat", UserObject.details().latitude)
                            .attr("data-long", UserObject.details().longitude)
                            .text(userDetails.viewlocation)
                            .removeClass("ion-locked");
                            elem.on('click', function (e) {
                                console.log("map clicked");
                            });
                        }
                        else if (UserObject.details().isprivate) {
                            elem.attr("disabled", "disabled")
                            .text(userDetails.broadcasting)
                            .addClass("ion-locked");
                        }

                        promise = function () {
                            chaserBroadcast.coords(UserObject.details().GUID).then(function () {
                                if (chaserBroadcast.data().broadcast)
                                {
                                    elem.attr("data-lat", chaserBroadcast.data().latitude)
                                       .attr("data-long", chaserBroadcast.data().longitude);
                                }
                                else
                                {
                                   scope.$apply(function () {
                                       scope.broadcasting = false;
                                    });
                                }
                            });
                        }

                        interval = $interval(function () { promise(); }, 30000);

                    }
                    else {
                        elem.attr("disabled", "disabled")
                        .text(userDetails.notBroadcasting);
                    }
                });

                scope.stopCoords = function () {
                    $interval.cancel(interval);
                };

                scope.$on('$destroy', function (event) {
                    scope.stopCoords();
                });
            }
        }
    }]);


})();