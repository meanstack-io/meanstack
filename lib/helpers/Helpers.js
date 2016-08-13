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
};

/**
 * min
 *
 * @returns {boolean}
 */
Helpers.prototype.min = function () {
    return (typeof this._config.minifyFiles !== 'undefined' && this._config.minifyFiles === true);
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
    var self = this;

    return Object.assign(
        {},
        {
            script: function (script) {
                return self._config.scripts + script + self.extension('js');
            },
            style: function (style) {
                return self._config.styles + style + self.extension('css');
            },
            image: function (image) {
                return self._config.images + image;
            },
            lib: function (lib) {
                return self._config.libs + lib;
            }
        },
        self._config.helpers
    );
};

module.exports = Helpers;
