(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope', 'LocalService', 'AuthenticationService'];
    function HomeController(UserService, $rootScope, LocalService, AuthenticationService) {
        var vm = this;
        
        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;
        vm.isLoggedIn = $rootScope.isLoggedIn;
        vm.isCollapsed = $rootScope.isCollapsed;

        initController();

        //function isLoggedIn() {
        //	return AuthenticationService.isAuthenticated();
        //}
        
        function initController() {
            loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
        	var auth_user = LocalService.get('auth_user');
            UserService.GetByUsername(auth_user)
                .then(function (response) {
                	//console.log(response);
                    vm.user = response.data[0];
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users.data;
                });
        }

        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
            });
        }
    }

})();