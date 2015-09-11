; (function () {
    angular.module('App').directive('pwudpateCheck', [function () {
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

    angular.module('App').directive('usernameupdateValidate', ['Settings', function (Settings) {
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
    /*
    angular.module('App').directive('usernameValidate', ['Registration', function (Registration) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var me = attrs.ngModel;
                //var min = attrs.ngMinlength;                
                scope.$watch(me, function (value) {
                    var theexpression = attrs.usernameValidate;
                    var flags = attrs.regexValidateFlags || '';

                    if (value) {
                        var regex = new RegExp(theexpression, flags);
                        var valid = regex.test(value);
                        ctrl.$setValidity('charactersvalid', valid);
                        if (valid) {
                            Registration.usernameCheck(value).then(function () {
                                var isValid = !Registration.data();
                                ctrl.$setValidity('usernamevalid', isValid);
                            });
                        }
                        else
                            ctrl.$setValidity('usernamevalid', true)
                    }
                    else {
                        ctrl.$setValidity('usernamevalid', true);
                        ctrl.$setValidity('charactersvalid', true);
                    }
                });
            }
        }
    }])
    */
    angular.module('App').directive('emailupdateValidate', ['Settings', '$timeout', function (Settings, $timeout) {
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