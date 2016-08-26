/**
 * Module load file path.
 *   controller,
 *   image,
 *   style,
 *
 * Example:
 *   ...
 *   controller: 'homeController', //Controller page
 *   resolve: {
 *   //Load dependencies
 *   deps: ['$ocLazyLoad', 'path', function ($ocLazyLoad, path) {
 *       return $ocLazyLoad.load({
 *           //Insert controller before id
 *           insertBefore: '#load_controllers',
 *           files: [
 *               //Return controller path according destination and minify.
 *               path.controller('homeController')
 *           ]
 *       },
 *       ...
 *
 * Config path directories in file ../config.js:
 *   ...
 *   path: {
 *       minify: true,
 *       controller: '/javascripts/',
 *       image: '/images/',
 *       style: '/stylesheets/'
 *   },
 *   ...
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * AppPath
 *
 * @type {angular.Module}
 */
var AppPath = angular.module('meanstack.path', []);

AppPath.provider('path', [function () {
    var settings = {};

    /**
     * Config module
     *
     * @param op_settings
     */
    this.config = function (op_settings) {
        settings = op_settings;
    };

    this.$get = [
        function () {
            var service = {},
                min = (typeof settings.minify === 'undefined' || settings.minify === true),
                extension = function (type) {
                    return ((min) ? '.min' : '') + '.' + type;
                };

            /**
             * Return controller path according destination and minify.
             *
             * @param controllerName
             * @returns {*}
             */
            service.controller = function (controllerName) {
                return settings.controllers + controllerName + extension('js');
            };

            /**
             * Return script path according destination and minify.
             *
             * @param script
             * @returns {string}
             */
            service.script = function (script) {
                return settings.scripts + script + extension('js');
            };

            /**
             * Return style path according destination and minify.
             *
             * @param style
             * @returns {string}
             */
            service.style = function (style) {
                return settings.styles + style + extension('css');
            };

            /**
             * Return image path.
             *
             * @param image
             * @returns {string}
             */
            service.image = function (image) {
                return settings.images + image;
            };

            /**
             * Return image path.
             *
             * @param lib
             * @returns {string}
             */
            service.lib = function (lib) {
                return settings.libs + lib;
            };

            return service;
        }
    ];
}]);
