; (function () {
    angular.module('App').factory("Settings", function ($http, $q, UserObject) {
        // defines a service used to populate initial data. Also persists value changes between pages.
        var data;
        var passwordUpdated = false;
        var emailUpdated = false;
        var usernameValid = false;
        var User = {};

        User.updateUser = function (user) {
            var deffered = $q.defer();
            var msg = { "guid": user.GUID, "firstName": user.firstname, "lastName": user.lastname, "username": user.username, "emailAddress": user.email, "private": user.private };
            $http.put(baseURL + "api/user", msg)
            .success(function (d) {
                data = d;
                deffered.resolve();
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        }

        User.updatePassword = function (password) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;
            passwordUpdated = false;
            var msg = { "guid": guid, "password": password };
            $http.post(baseURL + "api/update_password", msg)
            .success(function (d) {
                passwordUpdated = d;
                deffered.resolve();
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        User.emailCheck = function (email) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;
            emailUpdated = false;
            var msg = { "guid": guid, "email": email };
            $http.post(baseURL + "api/user_emailcheck", msg)
            .success(function (d) {
                emailUpdated = d;
                deffered.resolve();
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        User.usernameUpdated = function (username) {
            var deffered = $q.defer();
            var guid = UserObject.data().GUID;
            usernameValid = false;
            var msg = { "guid": guid, "username": username };
            $http.post(baseURL + "api/user_namecheck", msg)
            .success(function (d) {
                usernameValid = d;
                deffered.resolve();
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        User.data = function () { return data; }
        User.successfulPassword = function () { return passwordUpdated; }
        User.successfulEmail = function () { return emailUpdated; }
        User.successfulUsername = function () { return usernameValid; }

        return User;
    });

})();