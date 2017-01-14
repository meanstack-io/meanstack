/**
 * Module Route.
 *   Return route with namespace at application.
 *
 * Example:
 *   ['$resource', 'route', function ($resource, route) {
 *      return function (url) {
 *          return $resource(
 *              route.namespace(url),
 *              ...
 *
 *   route.namespace(), return '/api'
 *   route.namespace('/home'), return '/api/home'
 *
 * Config namespace in file ../config.js
 *   ...
 *   'route': {
 *       namespace: 'api'
 *   ...
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * AppRoute
 *
 * @type {angular.Module}
 */
var AppRoute = angular.module('meanstack.route', ['ui.router']);

AppRoute.provider("route", [function () {
    var settings = {};

    /**
     * Config module
     *
     * @param op_settings
     */
    this.config = function (op_settings) {
        settings = op_settings;
    };

    this.$get = ["$rootScope", "$state", function ($rootScope, $state) {
        var service = {};

        /**
         * namespace
         *
         * @param route
         * @returns {string}
         */
        service.namespace = function (route) {
            if (typeof route === 'undefined') {
                return '/' + settings.namespace;
            }

            return '/' + settings.namespace + '/' + route;
        };

        /**
         * templateNamespace
         *
         * $state.templateNamespace populate $state.templateUrl
         */
        service.templateNamespace = function () {

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                if (typeof toState.templateNamespace === 'undefined') {
                    return;
                }

                if (typeof toState.templateNamespace === 'string') {
                    return toState.templateUrl = service.namespace(toState.templateNamespace);
                } else if (typeof toState.templateNamespace === 'function') {
                    return toState.templateUrl = service.namespace(toState.templateNamespace(toParams));
                }

                throw new Error('Route ' + toState.url + ' - templateNamespace: It must be a function(with return string) or string.');
            });
        };

        /**
         * error
         *
         * Redirect to error pages.
         */
        service.error = function (status, exception) {
            status = status || ['404', '403', '500'];
            exception = exception || '500';

            $rootScope.$on('$stateChangeError',
                function (event, toState, toParams, fromState, fromParams, error) {
                    var errorStatus = String(error.status);

                    event.preventDefault();

                    if (status.indexOf(errorStatus) !== -1) {
                        return $state.go(errorStatus);
                    }

                    return $state.go(exception);
                });
        };

        /**
         * bootstrap
         *
         * register templateNamespace and error;
         */
        service.bootstrap = function (errorStatus, errorException) {

            $rootScope.$state = $state;

            service.templateNamespace();

            service.error(errorStatus, errorException);
        };

        return service;
    }];
}]);
