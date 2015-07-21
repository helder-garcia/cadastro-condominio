(function () {
    'use strict';

    angular
        .module('app')
        .factory('RenterService', RenterService);

    RenterService.$inject = ['$http', 'API_END_POINT'];
    function RenterService($http, API_END_POINT) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.GetByUnit = GetByUnit;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get(API_END_POINT + '/renters/').then(handleSuccess, handleError('Error getting all renters'));
        }

        function GetById(id) {
            return $http.get(API_END_POINT + '/renters/' + id).then(handleSuccess, handleError('Error getting renters by id'));
        }

        function GetByUsername(username) {
            return $http.get(API_END_POINT + '/renters?username=' + username).then(handleSuccess, handleError('Error getting renters by username'));
        }

        function GetByUnit(unitnumber) {
            return $http.get(API_END_POINT + '/renters?unit=' + unitnumber).then(handleSuccess, handleError('Error getting renters by username'));
        }

        function Create(renter) {
            return $http.post(API_END_POINT + '/renters', renter).then(handleSuccess, handleError('Error creating renters'));
        }

        function Update(renter) {
            return $http.put(API_END_POINT + '/renters/' + renter.id, renter).then(handleSuccess, handleError('Error updating renters'));
        }

        function Delete(id) {
            return $http.delete('/api/renters/' + id).then(handleSuccess, handleError('Error deleting renters'));
        }

        // private functions

        function handleSuccess(data) {
            return data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
