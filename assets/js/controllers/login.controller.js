(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService', '$state'];
    function LoginController($location, AuthenticationService, FlashService, $state) {
        var vm = this;

        vm.login = login;
        
        (function initController() {
            // reset login status
            //AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            vm.error = {};
            vm.error.success = true;
            AuthenticationService.Login(vm.username).success(function(result) {
            	vm.error.success = true;
            	$state.go('user.type');
            }).error(function(err) {           	
            	vm.error = err;
            	vm.dataLoading = false;
            });
            /*
            AuthenticationService.Login(vm.username, function (response) {
            	//console.log("<<<<< LOGIN CTRL")
            	//console.log(response.user.username);
                if (response.success) {
                	//LocalService.set('auth_user', JSON.stringify(response.user.username));
                	//LocalService.set('auth_token', JSON.stringify(response.token));
                    //AuthenticationService.SetCredentials(vm.username);
                    $location.path('/user-type');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
            */
        };
    }

})();
