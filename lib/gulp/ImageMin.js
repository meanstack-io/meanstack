/**
 * Compress image.
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
    $ = require('gulp-load-plugins')(),
    mergeObject = require('../support/MergeObject');

/**
 * ImageMin
 *
 * @param src
 * @param dist
 * @param options
 * @constructor
 */
var ImageMin = function (src, dist, options) {
    var config = mergeObject(
        {
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        },
        options || {}
    );

    gulp.src(src)
        .pipe(
            $.cache(
                $.imagemin(config)
            )
        )
        .pipe(gulp.dest(dist));
};

module.exports = ImageMin;
