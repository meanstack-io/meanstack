/**
 * ViewServiceProvider
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
    this._App.app.use(compression(config.compression || null));

    /**
     * Set static directory.
     *   Example: 'public/'
     *
     * [Optional]
     */
    if (config.static) {
        this._App.app.use(express.static(config.static));
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
