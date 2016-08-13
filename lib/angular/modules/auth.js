/**
 * Module authentication for AngularJS.
 *
 * Example:
 *   // Auth false
 *   .state('signin', {
 *       url: "/signin?r?p",
 *       templateUrl: namespace("account/signin"),
 *       ...
 *       // Control access
 *       access: {
 *           // Only access page if not login.
 *           auth: false,
 *           // Optional redirect: URL
 *           redirect: '/myaccount',
 *       }
 *       ...
 *
 *   // Auth true
 *   .state('myaccount', {
 *       url: '/myaccount',
 *       ...
 *       // Control access
 *       access: {
 *           // Only access page if logged.
 *           auth: true,
 *           // Optional redirect: URL
 *           redirect: '/signin'
 *           // redirect result, domain.com/signin?r=myaccount
 *           // after login will be redirected to myaccount.
 *           // if paramOfRedirect parameter is set to false will not be redirected.
 *           paramOfRedirect: false
 *       }
 *       ...
 *
 * Config redirect default in file ../config.js
 *   ...
 *   'auth': {
 *       redirect: {
 *           notLogged: '/signin',
 *           logged: '/myaccount'
 *           paramOfRedirect: true
 *       }
 *   }
 *   ...
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * AppAuth
 *
 * @type {angular.Module}
 */
var AppAuth = angular.module('meanstack.auth', []);

AppAuth.provider('auth', [function () {
    /**
     * settings
     *
     * @private
     * @type {{}}
     */
    var settings = {};

    /**
     * getAuthCookie
     *
     * @private
     * @returns {boolean}
     */
    var getAuthCookie = function () {
        var cookieName = settings.cookie,
            getCookieValues = function (cookie) {
                var cookieArray = cookie.split('=');
                return (typeof cookieArray[1] !== 'undefined') ? cookieArray[1].trim() : null;
            },
            getCookieNames = function (cookie) {
                var cookieArray = cookie.split('=');
                return (typeof cookieArray[0] !== 'undefined') ? cookieArray[0].trim() : null;
            },
            cookies = document.cookie.split(';'),
            cookieValue = cookies.map(getCookieValues)[cookies.map(getCookieNames).indexOf(cookieName)];

        return (typeof cookieValue === 'undefined') ? false : cookieValue;
    };

    /**
     * Config module
     *
     * @param op_settings
     */
    this.config = function (op_settings) {
        settings = op_settings;
    };

    this.$get = ['$stateParams',
        function ($stateParams) {
            var service = {};

            /**
             * Check user is logged
             *
             * @returns {boolean}
             */
            service.check = function () {
                return (getAuthCookie() !== false);
            };

            /**
             * Check permission
             *
             * @returns {boolean}
             */
            service.permission = function (permission) {
                var authCookie = getAuthCookie();

                if (Array.isArray(authCookie)) {
                    return (authCookie.indexOf(permission) !== -1);
                }

                return (authCookie === permission);
            };

            /**
             * Parameters redirection when login.
             *
             * @returns {{redirect: string, params: {}, defaultRedirect: boolean}}
             */
            service.paramsRedirectionLogin = function () {
                var redirect = (typeof $stateParams.r !== 'undefined') ? decodeURIComponent($stateParams.r) : settings.redirect.logged;

                return {
                    redirect: redirect,
                    params: (typeof $stateParams.p !== 'undefined') ? JSON.parse(decodeURIComponent($stateParams.p)) : {},
                    defaultRedirect: (redirect === settings.redirect.logged)
                };
            };

            /**
             * Route control access
             *
             * @param toState
             */
            service.routeAuth = function (event, $state, toState, toParams) {
                //if route not have control access
                if (typeof toState.access === 'undefined' || typeof toState.access.auth === 'undefined') {
                    return;
                }

                var authRoute = toState.access.auth,
                    redirect = {
                        notLogged: (typeof toState.access.redirect !== 'undefined') ? toState.access.redirect : settings.redirect.notLogged,
                        logged: (typeof toState.access.redirect !== 'undefined') ? toState.access.redirect : settings.redirect.logged
                    };

                //Only access page if logged.
                if (authRoute && !service.check()) {
                    var paramOfRedirect = (typeof toState.access.paramOfRedirect !== 'undefined') ? toState.access.paramOfRedirect : settings.redirect.paramOfRedirect;
                    var params = {};

                    if (paramOfRedirect) {
                        params.r = encodeURIComponent(toState.name);

                        if (Object.keys(toParams).length !== 0) {
                            params.p = encodeURIComponent(JSON.stringify(toParams));
                        }
                    }

                    event.preventDefault();

                    $state.go(redirect.notLogged, params);
                }
                //Only access page if not login.
                else if (!authRoute && service.check()) {

                    event.preventDefault();

                    $state.go(redirect.logged);
                }
            };

            return service;
        }
    ];
}]);
