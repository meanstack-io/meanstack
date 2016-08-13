/**
 * Config
 *   Load Configuration files.
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
var fs = require('fs'),
    path = require('path'),
    mergeConfig = require('../support/MergeObject');

/**
 * Config
 *
 * @param configPath
 * @constructor
 */
function Config(configPath) {

    this._config;

    this.load(configPath);
}

/**
 * load
 *
 * @param configPath
 */
Config.prototype.load = function (configPath) {

    // Returns an array of filenames.
    var filenames = fs.readdirSync(configPath);

    var config = {};

    filenames.forEach(function (filename) {
        var module = filename.replace(path.extname(filename), '');
        config[module] = require(path.resolve(configPath, filename));
    });

    this.env(config);
};

/**
 * Load environment file
 *
 * @param config
 * @returns {{}}
 */
Config.prototype.loadEnv = function (config) {
    return (fs.existsSync(config.app.env)) ? require(config.app.env) : {};
};

/**
 * Merge config environment
 *
 * @param config
 */
Config.prototype.env = function (config) {
    this._config = mergeConfig(config, this.loadEnv(config));
};

/**
 * Get configuration.
 *   Example: App.config.get('app').providers
 *
 * @param module
 * @returns {*}
 */
Config.prototype.get = function (module) {
    return this._config[module];
};

module.exports = Config;
