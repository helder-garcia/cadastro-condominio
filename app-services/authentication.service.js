(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService)
    	.factory('AuthInterceptor', AuthInterceptor);

    AuthenticationService.$inject = ['$http', '$rootScope', '$timeout', 'UserService', 'API_END_POINT', 'LocalService', 'AccessLevels'];
    function AuthenticationService($http, $rootScope, $timeout, UserService, API_END_POINT, LocalService, AccessLevels) {
        var service = {};

        service.Login = Login;
        service.logout = logout;
        service.authorize = authorize;
        service.isAuthenticated = isAuthenticated;
        service.getIdentifier = getIdentifier;
        //service.SetCredentials = SetCredentials;
        //service.ClearCredentials = ClearCredentials;

        return service;

        function authorize(access) {
            if (access === AccessLevels.user) {
              return this.isAuthenticated();
            } else {
              return true;
            }
          }
          
          function isAuthenticated() {
            return LocalService.get('auth_token');
          }

          function getIdentifier() {
              return LocalService.get('auth_user');
            }

        function Login(username, callback) {

            /*
			 * Dummy authentication for testing, uses $timeout to simulate api
			 * call ----------------------------------------------
			 */
        	/*
			 * $timeout(function () { var response;
			 * 
			 * UserService.GetByUsername(username) .then(function (obj) { if
			 * (obj.data[0].username === username) { response = { success: true }; }
			 * else { response = { success: false, message: 'Identificador
			 * incorreto//' }; } callback(response); }); }, 1000);
			 */
            // Use this for real authentication
            /* ---------------------------------------------- */
            $http.post(API_END_POINT + '/authenticates/authenticate', { username: username })
                .success(function (response) {
                	LocalService.set('auth_user', response.user.username);
                	LocalService.set('auth_token', response.token);
                	//LocalService.set('auth_unit', response.user.unitnumber);
                	callback(response);
                })
                .error(function(response){
                	callback(response);
                });;

        }

        function logout(callback) {
            // The backend doesn't care about logouts, delete the token and you're good to go.
            LocalService.unset('auth_token');
            LocalService.unset('auth_user');
        }
        /*
		 * function SetCredentials(username) { var authdata =
		 * Base64.encode(username);
		 * 
		 * $rootScope.globals = { currentUser: { username: username, authdata:
		 * authdata } };
		 * 
		 * $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; //
		 * jshint ignore:line $cookieStore.put('globals', $rootScope.globals); }
		 * 
		 * function ClearCredentials() { $rootScope.globals = {};
		 * $cookieStore.remove('globals');
		 * $http.defaults.headers.common.Authorization = 'Basic '; }
		 */
    }

    AuthInterceptor.$inject = ['$q', '$injector'];

    function AuthInterceptor($q, $injector) {
        var LocalService = $injector.get('LocalService');

        return {
          request: function(config) {
            var token;
            token = LocalService.get('auth_token');
            //if (LocalService.get('auth_token')) {
            //  token = angular.fromJson(LocalService.get('auth_token')).token;
              
            //}
            
            if (token) {
              config.headers.Authorization = 'Bearer ' + token;
            }
            
            return config;
          },
          responseError: function(response) {
            if (response.status === 401 || response.status === 403) {
              //LocalService.unset('auth_token');
              $injector.get('$state').go('anon.login');
            }
            return $q.reject(response);
          }
        }
      }
      

    // Base64 encoding service used by AuthenticationService
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

})();