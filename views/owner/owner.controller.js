(function () {
    'use strict';

    angular
        .module('app')
        .controller('OwnerController', OwnerController);

    OwnerController.$inject = ['$rootScope', '$scope', 'OwnerService', 'AuthenticationService', 'UserService', 'toaster'];
    function OwnerController($rootScope, $scope, OwnerService, AuthenticationService, UserService, toaster) {
    	var user = {};
    	$scope.phoneNumbrFixPtr = /^\d{2}-\d{4}-\d{4}$/;
    	$scope.phoneNumbrCelPtr = /^\d{2}-\d{4,5}-\d{4}$/;
    	$scope.vehicleNumberPtr = /^\w{3}-\d{4}$/;
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
    		toaster.pop('info', "Dados Gravados");
    		//$mdToast.show($mdToast.simple().content("Gravado").theme("toaster-success").position("bottom"));
    	}
  };
})();