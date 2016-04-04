; (function () {
    angular.module('App').controller('BlocksController', ['$scope','$state','$ionicLoading','$ionicPopup', 'Block', function ($scope, $state, $ionicLoading, $ionicPopup, Block) {
        
        $scope.imageURL = imageURL;
        var init = function () {
            $scope.index = 0;
            Block.blocks($scope.index).then(function (response) {
                $scope.blocks = response.Results;
                $scope.index++;
            });
        };

        init();

        $scope.back = function () {
            $state.go('main.dash');
        };        

        $scope.Unblock = function (ID, username, index) {
            var confirmPopup = $ionicPopup.confirm({
                title: BlockConst.unblockConfirmTitle.replace(/0/gi, username)
            });
            confirmPopup.then(function (res) {
                if (res) {
                    Block.DeleteBlock(ID).then(function (response) {
                        if (response === 1) {
                            $scope.blocksNo--;
                            $scope.blocks.splice(index, 1);
                        }
                        else {
                            var whoopsPopup = $ionicPopup.confirm({
                                title: BlockConst.unblockOops
                            });
                        }
                    });
                }
            });
        }

        $scope.loadMoreBlockers = function () {
            $scope.blocksNo = Block.data().Total;
            var pagingMax = Math.ceil($scope.blocksNo / countSet, 1);
            if ($scope.index < pagingMax && $scope.index > 0) {
                Block.blocks($scope.index).then(function (response) {
                    var merged = $scope.blocks.concat(response.Results);
                    $scope.blocks = merged;
                    $scope.index++;
                });
            }
            else if ($scope.index == pagingMax)
                $scope.noMoBlockers = true;

            $scope.$broadcast('scroll.infiniteScrollComplete');
        };


    }]);
})();