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
    mergeObject = require('../support/MergeObject');

/**
 * Config
 *
 * @param configPath
 * @constructor
 */
function Config(configPath) {

    this._config;

    // Merge config file and env file.
    this.mergeConfigs(configPath);
}

/**
 * Load config file.
 *
 * @param configPath
 * @return {{}}
 */
Config.prototype.loadConfigFile = function (configPath) {

    // Returns an array of filenames.
    var filenames = fs.readdirSync(configPath);

    var config = {};

    filenames.forEach(function (filename) {
        var module = filename.replace(path.extname(filename), '');
        config[module] = require(path.resolve(configPath, filename));
    });

    return config;
};

/**
 * Load environment file.
 *
 * @param config
 * @returns {{}}
 */
Config.prototype.loadEnvFile = function (config) {
    return (fs.existsSync(config.app.env)) ? require(config.app.env) : {};
};

/**
 * Merge configs
 *
 * @param configPath
 */
Config.prototype.mergeConfigs = function (configPath) {
    var config = this.loadConfigFile(configPath),
        env = this.loadEnvFile(config);

    this._config = mergeObject(config, env);
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
