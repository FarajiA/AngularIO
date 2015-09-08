; (function () {
    angular.module('main').directive('userChoice', ['UserObject', 'Decision', '$rootScope', function (UserObject, Decision, $rootScope) {
        return {
            restrict: 'A',
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
                                    $rootScope.followingNo++;
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
                                $rootScope.followingNo--;
                                scope.notChasing = true;
                                scope.yesChasing = false;
                            }
                        });
                    });
                };

                switch (UserObject.details().isChasing) {
                    case 0:
                        elem.attr('data-chasing', false);
                        break;
                    case 1:
                        elem.attr('data-chasing', true);
                        break;
                    case 2:
                        elem.attr('data-chasing', "requested").attr("disabled", "disabled");
                        break;
                }

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

})();