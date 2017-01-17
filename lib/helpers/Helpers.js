/**
 * Helpers for Handlebars.
 * More documentation:
 *     http://handlebarsjs.com/expressions.html#helpers,
 *     https://github.com/barc/express-hbs
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * Helpers
 *
 * @param App
 * @constructor
 */
var Helpers = function (App) {
    this._config = App.config.get('helpers');
    this._env = App.app.get('env');
};

/**
 * min
 *
 * @returns {boolean}
 */
Helpers.prototype.min = function () {
    return (typeof this._config.path.minify !== 'undefined' && this._config.path.minify === true);
};

/**
 * extension
 *
 * @param type
 * @returns {string}
 */
Helpers.prototype.extension = function (type) {
    return ((this.min()) ? '.min' : '') + '.' + type;
};

/**
 * register
 *
 * @returns {*}
 */
Helpers.prototype.register = function () {
    var self = this,
        helpersApp = require(self._config.helpers);

    return Object.assign(
        {},
        {
            script: function (script) {
                return self._config.path.scripts + script + self.extension('js');
            },
            style: function (style) {
                return self._config.path.styles + style + self.extension('css');
            },
            image: function (image) {
                return self._config.path.images + image;
            },
            lib: function (lib) {
                return self._config.path.libs + lib;
            },
            env: function (env, options) {
                return (self._env === env)
                    ? options.fn(this)
                    : options.inverse(this);
            }
        },
        helpersApp
    );
};

module.exports = Helpers;
