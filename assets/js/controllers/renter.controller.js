(function () {
    'use strict';

    angular
        .module('app')
        .controller('RenterController', RenterController);

    RenterController.$inject = ['$rootScope', '$scope', 'RenterService', 'AuthenticationService', 'UserService', 'toaster', '$state'];
    function RenterController($rootScope, $scope, RenterService, AuthenticationService, UserService, toaster, $state) {
    	var user = {};
    	$scope.phoneNumbrFixPtr = /^\d{2}-\d{4}-\d{4}$/;
    	$scope.phoneNumbrCelPtr = /^\d{2}-\d{4,5}-\d{4}$/;
    	$scope.vehicleNumberPtr = /^\w{3}-\d{4}$/;
    	$scope.renterEntry = {};
    	if (AuthenticationService.isAuthenticated()) {
    		$scope.renterEntry.username = AuthenticationService.getIdentifier();
            UserService.GetByUsername($scope.renterEntry.username)
            .then(function (response) {
            	if (response.success === false) $state.go('error.500');
                user = response.data[0];
                $scope.renterEntry.unit = user.unitnumber;
                RenterService.GetByUnit($scope.renterEntry.unit)
                .then(function (response) {
                		if (response.data.length === 0) {
                			$scope.isNew = true;
                		} else {
                			$scope.isNew = false;
                			$scope.renterEntry = response.data[0];
                		}
                }
                );
            });
 
    	}

    	$scope.save = function() {
    		if (AuthenticationService.isAuthenticated()) {
    			if ($scope.isNew) {
    				RenterService.Create($scope.renterEntry)
    				.then(function (response) {
    					toaster.pop('info', "Dados Gravados");
    				});
    			} else {
        			RenterService.Update($scope.renterEntry)
        			.then(function (response) {
        				toaster.pop('info', "Dados Gravados");
        			});    				
        			
    			}
    		}
    	}
  };
})();