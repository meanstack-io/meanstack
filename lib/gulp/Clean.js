/**
 * Clean
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
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

/**
 * Clean
 *
 * @param src
 * @param options
 */
var Clean = function (src, options) {
    return gulp.src(src, {read: false})
        .pipe($.clean(options || {}));
};

module.exports = Clean;
