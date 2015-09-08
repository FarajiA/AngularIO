; (function () {
    var app = angular.module('main');
    app.requires.push('lrInfiniteScroll');
    app.requires.push('ui.bootstrap');

    app.controller('FollowersController', ['$scope', '$location', 'UserObject', '$rootScope', '$timeout', '$modal', 'Followers', function ($scope, $location, UserObject, $rootScope, timer, $modal, Followers) {
       
        $scope.guid = null;
        $scope.deleteUsername = null;
        $scope.index = null;
        $scope.animationsEnabled = true;

        $scope.index = 0;        
        Followers.followers($scope.index).then(function () {
            $scope.followers = Followers.data();
            $scope.index++;
        });

        $scope.closeAlert = function () {
            $scope.alertNeeded = false;
        }

        $scope.loadMore = function () {
            var pagingMax = Math.ceil(UserObject.data().noChasers / countSet, 1);
            if ($scope.index < pagingMax) {
                Followers.followers($scope.index).then(function () {
                    var merged = Followers.data().concat($scope.followers);
                    $scope.followers = merged;
                    $scope.index++;
                });
            }
        };

        $scope.UserDetails = function (guid) {
            UserObject.getUser(guid).then(function (){
                $location.path("/user/" + UserObject.details().username);
            });            
        }

        $scope.Unfollow = function (guid,username,index) {
            $scope.deleteUsername = username;
            $scope.index = index;
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'UnfollowModal.html',
                controller: 'UnfollowModalInstance',
                resolve: {
                    deleteGuid: function () {
                        return $scope.guid = guid;
                    }
                }
            });

            modalInstance.result.then(function (successful) {
                var theUsername = $scope.deleteUsername;
                var responseMsg = deleteUserConst.successfullyDeleted.replace(/0/gi, theUsername)

                if (successful === 1) {
                    $scope.alert = { type: 'success', msg: responseMsg };
                    $scope.followers.splice($scope.index, 1)
                }
                else
                    $scope.alert = { type: 'danger', msg: deleteUserConst.notsuccessfullyDeleted };

              $scope.alertNeeded = true;
            }, function () {
                // console.log("delete following canceled");
            });
        };

    }]);


    app.controller('UnfollowModalInstance', function ($scope, $modalInstance, deleteGuid, Followers) {

        $scope.deleteUser = function () {
            Followers.unfollow(deleteGuid).then(function () {
                var successful = Followers.data();
                    $modalInstance.close(successful);
                });
        };
     
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });


})();