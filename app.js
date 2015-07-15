(function() {
	'use strict';

	angular.module('app', [ 'ui.router', 'configuration', 'ngMaterial', 'ngMessages', 'toaster'])
	// .module('app', ['ngRoute', 'ngCookies', 'configuration'])
	.config(config).run(run);
	/*
	 * config.$inject = ['$routeProvider', '$locationProvider']; function
	 * config($routeProvider, $locationProvider) { $routeProvider .when('/', {
	 * controller: 'HomeController', templateUrl: 'home/home.view.html',
	 * controllerAs: 'vm' })
	 * 
	 * .when('/login', { controller: 'LoginController', templateUrl:
	 * 'login/login.view.html', controllerAs: 'vm' })
	 * 
	 * .when('/register', { controller: 'RegisterController', templateUrl:
	 * 'register/register.view.html', controllerAs: 'vm' })
	 * 
	 * .otherwise({ redirectTo: '/login' }); }
	 */
	/*
	 * run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
	 * function run($rootScope, $location, $cookieStore, $http) { // keep user
	 * logged in after page refresh $rootScope.globals =
	 * $cookieStore.get('globals') || {}; if ($rootScope.globals.currentUser) {
	 * $http.defaults.headers.common['Authorization'] = 'Basic ' +
	 * $rootScope.globals.currentUser.authdata; // jshint ignore:line }
	 * 
	 * $rootScope.$on('$locationChangeStart', function (event, next, current) { //
	 * redirect to login page if not logged in and trying to access a restricted
	 * page var restrictedPage = $.inArray($location.path(), ['/login',
	 * '/register']) === -1; var loggedIn = $rootScope.globals.currentUser; if
	 * (restrictedPage && !loggedIn) { $location.path('/login'); } }); }
	 */
	config.$inject = [ '$stateProvider', '$urlRouterProvider', 'AccessLevels', '$httpProvider', '$mdThemingProvider' ];
	function config($stateProvider, $urlRouterProvider, AccessLevels, $httpProvider, $mdThemingProvider) {
		$stateProvider.state('anon', {
			abstract : true,
			template : '<ui-view/>',
			data : {
				access : AccessLevels.anon
			}
		}).state('anon.login', {
			url : '/login',
			templateUrl : 'login/login.view.html',
			controller : 'LoginController',
			controllerAs : 'vm'
		});
		$stateProvider.state('user', {
			abstract : true,
			template : '<ui-view/>',
			controller : 'navController',
			data : {
				access : AccessLevels.user
			}
		}).state('user.type', {
			url : '/user-type',
			templateUrl : 'home/home.view.html',
			controller : 'HomeController',
			controllerAs : 'vm'
		}).state('user.owner', {
			url : '/user-owner',
			templateUrl : 'views/owner/owner.view.html',
			controller : 'OwnerController'
		}).state('user.renter', {
			url : '/user-renter',
			templateUrl : 'views/renter/renter.view.html'
		});
		$stateProvider.state('error', {
			abstract : true,
			template : '<ui-view/>',
		}).state('error.500', {
			url : '/error-500',
			templateUrl : 'views/500.ejs'
		});
		$urlRouterProvider.otherwise('/login');
		$httpProvider.interceptors.push('AuthInterceptor');
		
		$mdThemingProvider.theme('default')
			.primaryPalette('blue-grey')
			.accentPalette('grey')
			.warnPalette('red');
		$mdThemingProvider.theme('toaster-success')
			.primaryPalette('teal');
		$mdThemingProvider.theme('toaster-error')
			.primaryPalette('red');
	};

	run.$inject = [ '$rootScope', '$state', 'AuthenticationService', '$injector', 'LocalService' ];
	
	function run($rootScope, $state, AuthenticationService, $injector, LocalService) {
		/*
		$injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
			var token;
			token = LocalService.get('auth_token');
			//token = "teste";
			console.log('interceptor passed ' + token);
			
			headersGetter()['Authorization'] = "Bearer " + token;
			if (data) {
				return angular.toJson(data);
			}	
		};
		*/
		
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			if (!AuthenticationService.authorize(toState.data.access)) {
				event.preventDefault();
				$state.go('anon.login');
			}
		});
        $rootScope.$state = $state;
        //$rootScope.$stateParams = $stateParams;
        $rootScope.$on("$stateChangeSuccess",  function(event, toState, toParams, fromState, fromParams) {
            // to be used for back button //won't work when page is reloaded.
            $rootScope.previousState_name = fromState.name;
            $rootScope.previousState_params = fromParams;
        });
        //back button function called from back button's ng-click="back()"
        $rootScope.back = function() {
            $state.go($rootScope.previousState_name,$rootScope.previousState_params);
        };	
	}

})();