; (function () {
    angular.module('App').controller('SearchController', ['$scope', '$rootScope', 'UserObject', function ($scope, $rootScope, UserObject) {
       
        console.log("Enter search controller");
        $rootScope.title = "Search";



        /*
        $scope.UserDetails = function (guid) {
            console.log("Details clicked: " + guid);
            UserObject.getUser(guid).then(function () {
                $location.path("/user/" + UserObject.details().username);
            });
        }
        */
    }]);
})();