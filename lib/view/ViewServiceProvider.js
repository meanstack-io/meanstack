/**
 * ViewServiceProvider
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2017, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */
var ServiceProvider = require('../support/ServiceProvider'),
    express = require('express'),
    hbs = require('express-hbs'),
    compression = require('compression'),
    serveFavicon = require('serve-favicon');

/**
 * ViewServiceProvider
 *
 * @type {Function}
 */
var ViewServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
    this._config = App.config.get('view');
});

/**
 * Register ViewService.
 *
 * @param done
 */
ViewServiceProvider.prototype.register = function (done) {
    var config = this._config;

    /**
     * Config engine.
     * By default the framework uses the handlebars.
     */
    this._App.app.engine('hbs', hbs.express4(config.engine));
    this._App.app.set('view engine', 'hbs');

    /**
     * Views, the directory where the template files are located.
     */
    this._App.app.set('views', config.path);

    /**
     * Node.js compression middleware.
     *   - deflate
     *   - gzip
     *
     * Documentation: https://github.com/expressjs/compression
     */
    if (config.compression && config.compression.active) {
        delete config.compression.active;

        this._App.app.use(compression(config.compression));
    }

    /**
     * Set static directory.
     *   Example: 'public/'
     *
     * [Optional]
     */
    if (config.static) {
        this._App.app.use(express.static(config.static.path, config.static.options));
    }

    /**
     * View cache
     *
     * Enables view template compilation caching.
     * true in production, otherwise undefined.
     */
    if (typeof config.cache !== 'undefined') {
        this._App.app.set('view cache', config.cache);
    }

    /**
     * X-Powered-By: Express
     *
     * Enables the "X-Powered-By: Express" HTTP header.
     */
    if (typeof config['x-powered-by'] !== 'undefined') {
        this._App.app.set('x-powered-by', config['x-powered-by']);
        this._App.app.disable('x-powered-by');
    }

    /**
     * Node.js middleware for serving a favicon.
     *
     * [Optional]
     */
    if (config.favicon) {
        this._App.app.use(serveFavicon(config.favicon));
    }

    done();
};

module.exports = ViewServiceProvider;
