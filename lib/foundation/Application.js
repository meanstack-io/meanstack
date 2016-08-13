'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path'),
    util = require('util'),
    debug = require('debug')('meanstack:application'),
    color = require('../support/Color'),
    server = require('../support/Server'),
    ServiceProvider = require('../support/ServiceProvider'),
    Config = require('../config');

function App() {

    this._server;

    this._providers = [];

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
 */
App.prototype.bootstrap = function (callback) {

    debug('Bootstrap application...');

    this.loadProviders();

    this.registerProviders();

    this.bootProviders();

    if (typeof callback === 'function') {
        callback(this);
    }
};

/**
 * Load providers
 */
App.prototype.loadProviders = function () {
    var self = this;
    var providers = self.config.get('app').providers;

    providers.forEach(function (providerPath) {
        var service = new (require(providerPath))(self);

        if (!(service instanceof ServiceProvider)) {
            throw Error(util.format('Provider: %s is not an instance of ServiceProvider class', providerPath));
        }

        self.setProviders({path: providerPath, service: service});
    });
};

/**
 * Set provider.
 */
App.prototype.setProviders = function (provider) {
    this._providers.push(provider);
    debug('loaded %s', provider.path);
};

/**
 * Register providers
 */
App.prototype.registerProviders = function () {
    var self = this;

    self._providers.forEach(function (provider) {
        provider.service.register(function () {
            debug('registred %s', provider.path);
        });
    });
};

/**
 * Boot providers
 */
App.prototype.bootProviders = function () {
    var self = this;

    self._providers.forEach(function (provider) {
        provider.service.boot(function () {
            debug('booted %s', provider.path);
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

        console.log('\r\n');
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
