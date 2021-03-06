﻿; (function () {

    angular.module('App').directive('usernameupdateValidate', ['Settings', function (Settings) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var me = attrs.ngModel;
                var min = attrs.ngMinlength;
                scope.$watch(me, function (value) {
                    var theexpression = attrs.usernameupdateValidate;
                    var flags = attrs.regexValidateFlags || '';
                    if (value) {
                        var regex = new RegExp(theexpression, flags);
                        var valid = regex.test(value);
                        ctrl.$setValidity('charactersvalid', valid);
                        if (valid) {
                            Settings.usernameUpdated(value).then(function () {
                                var isValid = Settings.successfulUsername();
                                ctrl.$setValidity('usernameupdatevalid', isValid);

                            });
                        }
                    }
                });
            }
        }
    }]);

    angular.module('App').directive('ogpasswordCheck', ['Settings', function (Settings) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs, ctrl) {
                var me = attrs.ngModel;
                var watchModel = attrs.ogpasswordCheck;

                elem.on('focus', function () {
                    scope.$apply(function () {
                        scope.oldpasswordInvalid = false;
                    });                   
                });

                elem.on('blur', function () {
                    var value = elem.val();
                    var valid = Settings.passwordValid(value);
                    if (!valid) {
                        scope.$apply(function () {
                            scope.oldpasswordInvalid = true;
                        });
                    }
                });
            }
        }
    }]);

    angular.module('App').directive('pwupdateCheck', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var me = attrs.ngModel;
                var matchTo = attrs.pwupdateCheck;

                scope.$watchGroup([me, matchTo], function (value) {
                    ctrl.$setValidity('pwmatch', value[0] === value[1]);
                });
            }
        }
    }]);

    angular.module('App').directive('pwValidate', [function () {
        /* Attributes to add for validation to include alphabet & numeral
           pw-validate="^(?=.{6,})(?=.*[a-zA-Z])(?=.*[0-9]).*$" regex-validate-flags="g"
        */
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var me = attrs.ngModel;
                elem.bind('focusin', function () {
                    ctrl.$setValidity('passwordvalid', true);
                });

                elem.bind('blur', function () {
                    var value = elem.val();
                    var theexpression = attrs.pwValidate;
                    var flags = attrs.regexValidateFlags || '';
                    if (value) {
                        var regex = new RegExp(theexpression, flags);
                        var valid = regex.test(value);
                        ctrl.$setValidity('passwordvalid', valid);
                    }
                    else
                        ctrl.$setValidity('passwordvalid', true);
                });
            }
        }
    }]);

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
                            ctrl.$setValidity('emailupdatevalid', isValid);
                        });
                    }
                });
                elem.bind('focusin', function () {
                    ctrl.$setValidity('emailupdatevalid', true);
                });
            }
        }
    }]);

})();