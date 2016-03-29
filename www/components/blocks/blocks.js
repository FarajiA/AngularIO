; (function () {
    angular.module('App').controller('BlocksController', ['$scope', 'Block', function ($scope, Block) {
        
        var init = function () {

        }


        $scope.back = function () {
            $state.go('main.dash');
        };




        $scope.unblockChaser = function (guid) {
            console.log("Block user " + guid);
        }


    }]);
})();