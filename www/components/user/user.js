; (function () {
    angular.module('App').controller('UserController', ['$scope', 'UserObject', '$stateParams', 'Decision', '$location', '$ionicModal', function ($scope, UserObject, $stateParams, Decision, $location, $ionicModal) {
        
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