/**
 * BodyParserServiceProvider
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
    bodyParser = require('body-parser');

/**
 * BodyParserServiceProvider
 *
 * @param App
 * @type {Function}
 */
var BodyParserServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
});

/**
 * Register the Body Parser.
 *
 * @param done
 */
BodyParserServiceProvider.prototype.register = function (done) {

    var config = this._App.config.get('bodyParser');

    this._App.app.use(bodyParser.json(config.json || ''));
    this._App.app.use(bodyParser.raw(config.raw || ''));
    this._App.app.use(bodyParser.text(config.text || ''));
    this._App.app.use(bodyParser.urlencoded(config.urlencoded || ''));

    done();
};

module.exports = BodyParserServiceProvider;
