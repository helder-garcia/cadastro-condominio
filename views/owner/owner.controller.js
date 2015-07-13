(function () {
    'use strict';

    angular
        .module('app')
        .controller('OwnerController', OwnerController);

    OwnerController.$inject = ['$rootScope', '$scope', 'OwnerService', 'AuthenticationService', 'UserService'];
    function OwnerController($rootScope, $scope, OwnerService, AuthenticationService, UserService) {
    	var user = {};
    	$scope.ownerEntry = {};
    	if (AuthenticationService.isAuthenticated()) {
    		$scope.ownerEntry.username = AuthenticationService.getIdentifier();
            UserService.GetByUsername($scope.ownerEntry.username)
            .then(function (response) {
                user = response.data[0];
                $scope.ownerEntry.unit = user.unitnumber;
            });
    	}
    	
    	$scope.ownerEntry.isResident = "SIM";
    	$scope.save = function() {
    		OwnerService.Create($scope.ownerEntry);
    	}
  };
})();