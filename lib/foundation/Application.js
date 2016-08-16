/**
 * Application
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
var express = require('express'),
    http = require('http'),
    path = require('path'),
    util = require('util'),
    debug = require('debug')('meanstack:application'),
    color = require('../support/Color'),
    server = require('../support/Server'),
    ServiceProvider = require('../support/ServiceProvider'),
    Config = require('../config'),
    Promise = require('bluebird');

/**
 * App
 *
 * @constructor
 */
function App() {

    this._server;

    this.config;

    this.app = express();
}

/**
 * Bind config path.
 *
 * @param configPath
 */
App.prototype.bindConfigPath = function (configPath) {
    this.config = new Config(configPath);
};

/**
 * Bootstrap application.
 *
 * @param callback
 * @return {void}
 */
App.prototype.bootstrap = function (callback) {
    var self = this;

    debug('Bootstrap application...');

    this.resolveProvider()
        .then(function () {
            debug('All providers have been initialized.');

            if (typeof callback === 'function') {
                callback(self);
            }
        });
};

/**
 * Resolve provider
 *
 * @return {Promise}
 */
App.prototype.resolveProvider = function () {
    return this.loadProvider()
        .then(this.registerProviders)
        .then(this.bootProviders)
        .catch(function (e) {
            throw new Error(e);
        });
};

/**
 * Resolve provider
 *
 * @return {Promise}
 */
App.prototype.loadProvider = function () {
    var self = this;
    var providers = self.config.get('app').providers;

    return Promise.map(providers, function (provider) {
        var Provider = new (require(provider))(self);

        if (!(Provider instanceof ServiceProvider)) {
            throw new Error(util.format('Provider: %s is not an instance of ServiceProvider class', provider));
        }

        // Saves the file path for debugging.
        Provider.path = provider;

        return Provider;
    });
};

/**
 * Register providers
 *
 * @param providers
 * @return {Promise}
 */
App.prototype.registerProviders = function (providers) {
    return Promise.each(providers, function (provider) {

        return new Promise(function (resolve) {
            provider.register(function () {
                debug('registered %s', provider.path);

                return resolve(true);
            });
        });
    });
};

/**
 * Boot providers
 *
 * @param providers
 * @return {Promise}
 */
App.prototype.bootProviders = function (providers) {
    return Promise.each(providers, function (provider) {

        return new Promise(function (resolve) {
            provider.boot(function () {
                debug('booted %s', provider.path);

                return resolve(true);
            });
        });
    });
};

/**
 * Create a node server and listen for requests.
 */
App.prototype.listen = function (callback) {

    var self = this;

    /**
     * Get port from environment and store in Express.
     */
    var port = server.normalizePort(process.env.PORT || self.config.get('app').port);
    self.app.set('port', port);

    /**
     * Create HTTP server.
     */
    self._server = http.createServer(self.app);

    /**
     * Listen on provided port, on all network interfaces.
     */
    self._server.listen(port, self.config.get('app').hostname);

    /**
     * Event listener for HTTP server "error" event.
     */
    self._server.on('error', function (error) {

        debug(error);

        if (error.syscall !== 'listen') {
            throw error;
        }

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(color.red('%s requires elevated privileges'), server.pipePort(port));
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(color.red('%s is already in use'), server.pipePort(port));
                process.exit(1);
                break;
            default:
                throw error;
        }
    });

    /**
     * Event listener for HTTP server "listening" event.
     */
    self._server.on('listening', function () {
        var listening = server.listening(self._server.address().port);

        debug(listening);

        console.log(color.green("╔══════════════════════════════════════════════════════════╗"));
        console.log(color.green("║ -------- ███╗   ███╗███████╗ █████╗ ███╗   ██╗ --------- ║"));
        console.log(color.green("║ -------- ████╗ ████║██╔════╝██╔══██╗████╗  ██║ --------- ║"));
        console.log(color.green("║ -------- ██╔████╔██║█████╗  ███████║██╔██╗ ██║ --------- ║"));
        console.log(color.green("║ -------- ██║╚██╔╝██║██╔══╝  ██╔══██║██║╚██╗██║ --------- ║"));
        console.log(color.green("║ -------- ██║ ╚═╝ ██║███████╗██║  ██║██║ ╚████║ --------- ║"));
        console.log(color.green("║ -------- ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ --------- ║"));
        console.log(color.green("║ ███████╗████████╗ █████╗  ██████╗██╗  ██╗   ██╗ ██████╗  ║"));
        console.log(color.green("║ ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝   ██║██╔═══██╗ ║"));
        console.log(color.green("║ ███████╗   ██║   ███████║██║     █████╔╝    ██║██║   ██║ ║"));
        console.log(color.green("║ ╚════██║   ██║   ██╔══██║██║     ██╔═██╗    ██║██║   ██║ ║"));
        console.log(color.green("║ ███████║   ██║   ██║  ██║╚██████╗██║  ██╗██╗██║╚██████╔╝ ║"));
        console.log(color.green("║ ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝ ╚═════╝  ║"));
        console.log(color.green("╚═Licensed under MIT═══════════════════════════════════════╝"));
        console.log(color.blue(listening));

        if (callback) {
            callback(self._server);
        }
    });
};

module.exports = App;
