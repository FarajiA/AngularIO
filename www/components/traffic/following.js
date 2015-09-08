; (function () {
    var app = angular.module('main');
    app.requires.push('lrInfiniteScroll');

    app.controller('FollowingController', ['$scope', '$location', 'UserObject', 'Following', function ($scope, $location, UserObject, Following) {
       
        $scope.index = 0;
        Following.following($scope.index).then(function () {
            $scope.following = Following.data().Results;
            $scope.index++;
        });

        $scope.loadMore = function () {
            var pagingMax = Math.ceil(UserObject.data().noChasing / countSet, 1);
            if ($scope.index < pagingMax) {
                Following.following($scope.index).then(function () {
                    var merged = Following.data().concat($scope.following);
                    $scope.following = merged;
                    $scope.index++;
                });
            }
        };

        $scope.UserDetails = function (guid) {
            UserObject.getUser(guid).then(function () {
                $location.path("/user/" + UserObject.details().username);
            });
        }

    }]);
})();