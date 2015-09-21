; (function () {
    angular.module('App').controller('UserController', ['$scope', 'UserObject', '$stateParams', 'Decision', '$location', function ($scope, UserObject, $stateParams, Decision, $location) {
        
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
       
   });

   var path = $location.path().split("/") || "Unknown";
   $scope.segment = path[2];


   }]);
})();