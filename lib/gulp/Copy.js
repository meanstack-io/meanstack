/**
 * Copy
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
 * Copy directory
 *
 * @param src
 * @param dist
 * @param rename
 * @returns {*}
 * @constructor
 */
var Copy = function (src, dist, rename) {

    return gulp.src(src, {dot: true})
        .pipe(
            $.if(
                rename,
                $.rename(rename)
            )
        )
        .pipe(gulp.dest(dist));
};

module.exports = Copy;
