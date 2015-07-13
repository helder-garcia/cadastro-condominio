(function () {
    'use strict';

    angular
        .module('app')
        .factory('OwnerService', OwnerService);

    OwnerService.$inject = ['$http', 'API_END_POINT'];
    function OwnerService($http, API_END_POINT) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get(API_END_POINT + '/owners/').then(handleSuccess, handleError('Error getting all owners'));
        }

        function GetById(id) {
            return $http.get(API_END_POINT + '/owners/' + id).then(handleSuccess, handleError('Error getting owners by id'));
        }

        function GetByUsername(username) {
            return $http.get(API_END_POINT + '/owners?username=' + username).then(handleSuccess, handleError('Error getting owners by username'));
        }

        function Create(owner) {
            return $http.post(API_END_POINT + '/owners', owner).then(handleSuccess, handleError('Error creating owners'));
        }

        function Update(user) {
            return $http.put(API_END_POINT + '/owners/' + user.id, user).then(handleSuccess, handleError('Error updating owners'));
        }

        function Delete(id) {
            return $http.delete('/api/owners/' + id).then(handleSuccess, handleError('Error deleting owners'));
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
