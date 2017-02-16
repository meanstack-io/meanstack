/**
 * SitemapServiceProvider
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
    Sitemap = require('./Sitemap');

/**
 * DatabaseServiceProvider
 *
 * @param App
 * @type {Function}
 */
var SitemapServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
    this._sitemap = new Sitemap(App);
});

/**
 * Register Database.
 *
 * @param done
 */
SitemapServiceProvider.prototype.register = function (done) {

    this._App.Sitemap = this._sitemap.instanse();

    done();
};

/**
 * Boot Sitemap
 *
 * @param done
 */
SitemapServiceProvider.prototype.boot = function (done) {
    var self = this;

    this._App.app.get('/sitemap.xml', function (req, res) {
        self._App.Sitemap.toXML(function (err, xml) {
            if (err) {
                return res.status(500).end();
            }
            res.header('Content-Type', 'application/xml');
            res.send(xml);
        });
    });

    done();
};

module.exports = SitemapServiceProvider;
