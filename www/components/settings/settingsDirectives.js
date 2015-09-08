; (function () {
    angular.module('main').directive('pwudpateCheck', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var me = attrs.ngModel;
                var matchTo = attrs.pwudpateCheck;

                scope.$watchGroup([me, matchTo], function (value) {
                    ctrl.$setValidity('pwmatch', value[0] === value[1]);
                });
            }
        }
    }]);

    angular.module('main').directive('usernameupdateValidate', ['Settings', function (Settings) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var me = attrs.ngModel;
                var min = attrs.ngMinlength;
                scope.$watch(me, function (value) {
                    if (value) {
                        Settings.usernameUpdated(value).then(function () {
                            var isValid = Settings.successfulUsername();
                            ctrl.$setValidity('usernameupdatevalid', isValid);
                        });
                    }
                });
            }
        }
    }]);

    angular.module('main').directive('emailupdateValidate', ['Settings', '$timeout', function (Settings, $timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var me = attrs.ngModel;
                var pattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                elem.bind('blur', function () {
                    var value = elem.val();
                    if (pattern.test(value)) { 
                        Settings.emailCheck(value).then(function () {
                            var isValid = Settings.successfulEmail();
                            if (!isValid) {
                                $timeout(function () {
                                    scope.alertNeeded = true;
                                    scope.alert = { type: 'danger', msg: updatedUserConst.emailInUse };                                    
                                });
                            }
                            else {
                                $timeout(function () {
                                    scope.alert = {};
                                    scope.alertNeeded = false;

                                });
                            }
                            ctrl.$setValidity('emailupdatevalid', isValid);
                        });
                    }
                });
            }
        }
    }]);

})();