/**
 * Sitemap
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
var util = require('util'),
    debug = require('debug')('meanstack:sitemap'),
    mergeObject = require('../support/MergeObject');

/**
 * Sitemap
 *
 * @param App
 * @constructor
 */
var Sitemap = function (App) {
    this._config = mergeObject(
        {
            'hostname': App.config.get('app').url
        },
        App.config.get('sitemap')
    );

    this.sitemap = require('sitemap');
};

/**
 * Sitemap
 *
 * @return {*|Sitemap}
 */
Sitemap.prototype.instanse = function () {
    var self = this;

    return self.sitemap.createSitemap(self._config);
};

module.exports = Sitemap;
