angular.module('app')
	.controller('navController', ['$rootScope', '$scope', 'AuthenticationService', '$state', function($rootScope, $scope, AuthenticationService, $state) {
		  $rootScope.isCollapsed = true;
		  $rootScope.isLoggedIn = true;
		  $scope.$state = $state;
		  $scope.logout = function() {
			  AuthenticationService.logout();
			  $state.go('anon.login');
	      }
		  $scope.isAuthenticated = function() {
			  return AuthenticationService.isAuthenticated();
		  }
}]);