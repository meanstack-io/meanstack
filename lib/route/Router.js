/**
 * Router
 * Add functions additional for Router express
 *
 *   Methods:
 *     Router().controller('admin.account'),
 *     Router().useController('/admin/account', 'admin.account'),
 *     Router().useViewAutoLoad('/view'),
 *     Router().namespace('view'),
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */
var flatten = require('array-flatten'),
    slice = Array.prototype.slice,
    util = require('util'),
    router = require('express').Router;

/**
 * Router
 *
 * @param App
 * @returns {*}
 * @constructor
 */
var Router = function (App) {
    var config = App.config.get('app');

    /**
     * Method controller
     *
     * @param controller
     * @returns {*}
     */
    router.controller = function (controller) {
        return require(util.format('%s/%s', config.controllers, controller.replace(/\./g, '/')));
    };

    /**
     * Method useController
     *
     * @param fn
     * @returns {router}
     */
    router.useController = function (fn) {
        var route = arguments[0],
            controllers = flatten(slice.call(arguments, 1));

        if (typeof route !== 'string') {
            throw new TypeError('Route undefined.');
        }

        for (var i = 0; i < controllers.length; i++) {
            var controller = controllers[i];

            if (typeof controller !== 'string') {
                throw new TypeError('Controller undefined.');
            }

            this.use(route, router.controller(controller));
        }

        return this;
    };

    /**
     * Method useViewAutoLoad
     *
     * @param route
     * @returns {router}
     */
    router.useViewAutoLoad = function (route) {

        if (typeof route !== 'string') {
            throw new TypeError('Route undefined.');
        }

        this.get(route + '/*', function (req, res) {

            var url = req.params[0];

            res.render(url);
        });

        return this;
    };

    /**
     * Method namespace
     *
     * @param route
     * @returns {String}
     */
    router.namespace = function (route) {
        if (typeof route === 'undefined') {
            return util.format('/%s', config.namespace);
        }

        return util.format('/%s/%s', config.namespace, route);
    };

    return router;
};

module.exports = Router;
