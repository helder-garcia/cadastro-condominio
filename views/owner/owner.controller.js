(function () {
    'use strict';

    angular
        .module('app')
        .controller('OwnerController', OwnerController);

    OwnerController.$inject = ['$rootScope', '$scope', 'OwnerService', 'AuthenticationService', 'UserService', 'toaster', '$state'];
    function OwnerController($rootScope, $scope, OwnerService, AuthenticationService, UserService, toaster, $state) {
    	var user = {};
    	$scope.phoneNumbrFixPtr = /^\d{2}-\d{4}-\d{4}$/;
    	$scope.phoneNumbrCelPtr = /^\d{2}-\d{4,5}-\d{4}$/;
    	$scope.vehicleNumberPtr = /^\w{3}-\d{4}$/;
    	$scope.ownerEntry = {};
    	//$scope.ownerEntry.isResident = "SIM";
    	//$scope.isNew = true;
    	if (AuthenticationService.isAuthenticated()) {
    		$scope.ownerEntry.username = AuthenticationService.getIdentifier();
            UserService.GetByUsername($scope.ownerEntry.username)
            .then(function (response) {
            	console.log(JSON.stringify(response));
            	if (!response.success) 
            		$state.go('error.500');
                user = response.data[0];
                $scope.ownerEntry.unit = user.unitnumber;
                OwnerService.GetByUnit($scope.ownerEntry.unit)
                .then(function (response) {
                		if (response.data.length === 0) {
                			$scope.isNew = true;
                			$scope.ownerEntry.isResident = "SIM";
                		} else {
                			$scope.isNew = false;
                			$scope.ownerEntry = response.data[0];
                		}
                }
                );
            });
 
    	}
    	
    	$scope.ownerEntry.isResident = "SIM";
    	$scope.save = function() {
    		if (AuthenticationService.isAuthenticated()) {
    			if ($scope.isNew) {
    				OwnerService.Create($scope.ownerEntry)
    				.then(function (response) {
    					toaster.pop('info', "Dados Gravados");
    				});
    			} else {
        			OwnerService.Update($scope.ownerEntry)
        			.then(function (response) {
        				toaster.pop('info', "Dados Gravados");
        			});    				
        			
    			}
    		}
    	}
  };
})();