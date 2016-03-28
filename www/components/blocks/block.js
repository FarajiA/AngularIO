; (function () {
    angular.module('App').controller('BlocksController', ['$scope', 'Block', function ($scope, Block) {
        
        $scope.back = function () {
            $state.go('main.dash');
        };





    }]);
})();