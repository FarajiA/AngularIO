; (function () {
    angular.module('App').controller('UserController', ['$scope', 'UserObject', '$stateParams', 'Decision', '$rootScope', function ($scope, UserObject, $stateParams, Decision, $rootScope) {
        
        var userID = $stateParams.userId;

   UserObject.getUser(userID).then(function () {
       $rootScope.title = UserObject.details().username;
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
        
       
       


       /*
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
        */
     });

        /*
        $scope.userfollowers = function () {
            $location.path("/user/" + $scope.username + "/followers");
        }

        $scope.userfollowing = function () {
            $location.path("/user/" + $scope.username + "/following");
        }
        */

    }]);
})();