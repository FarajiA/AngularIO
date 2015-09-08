; (function () {
    angular.module('App').controller('UserController', ['$scope', 'UserObject', '$rootScope', 'Decision', function ($scope, UserObject, $rootScope, Decision) {
        
        $scope.username = UserObject.details().username;
        $scope.firstname = UserObject.details().firstname;
        $scope.lastname = UserObject.details().lastname;
        $scope.noChasers = UserObject.details().noChasers;
        $scope.noChasing = UserObject.details().noChasing;
        $scope.isChasing = UserObject.details().isChasing;

        switch (UserObject.details().isChasing) {
            case 0:
                $scope.notChasing = true;
                $scope.isFollowing = activityConst.follow;
                break;
            case 1:
                $scope.yesChasing = true;
                $scope.isFollowing = activityConst.following;
                break;
            case 2:
                $scope.requested = true;
                $scope.isFollowing = activityConst.requested;
                break;
        }

        $scope.userfollowers = function () {
            $location.path("/user/" + $scope.username + "/followers");
        }

        $scope.userfollowing = function () {
            $location.path("/user/" + $scope.username + "/following");
        }

    }]);
})();