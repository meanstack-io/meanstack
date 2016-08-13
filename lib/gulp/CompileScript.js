/**
 * Compile script.
 *
 * gulp --option:
 *   gulp --production create only files min
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
var argv = require('minimist')(process.argv.slice(2)),
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    lazypipe = require('lazypipe'),
    mergeObject = require('../support/MergeObject');

/**
 * CompileScript
 *
 * @param src
 * @param dist
 * @param options
 */
var CompileScript = function (src, dist, options) {

    var config = mergeObject(
        {
            jshint: true,
            jshintReporter: 'default',
            concat: false,
            name: 'script.js',
            rename: {
                suffix: '.min'
            },
            sourcemaps: {
                init: {
                    loadMaps: true
                },
                write: {
                    dir: '/maps',
                    options: {}
                }
            },
            plumber: {
                errorHandler: function (error) {
                    console.log(error.message);
                    this.emit('end');
                }
            }
        },
        options
    );

    var jshintPipe = lazypipe()
        .pipe($.jshint)
        .pipe($.jshint.reporter, config.jshintReporter);

    var productionPipe = lazypipe()
        .pipe($.rename, config.rename)
        .pipe($.uglify);

    return gulp.src(src)
        .pipe($.sourcemaps.init(config.sourcemaps.init))
        .pipe($.plumber(config.plumber))
        .pipe(
            $.if(
                config.jshint,
                jshintPipe()
            )
        )
        .pipe(
            $.if(
                config.concat,
                $.concat(config.name)
            )
        )
        .pipe(
            $.if(
                argv.production,
                productionPipe()
            )
        )
        .pipe(
            $.sourcemaps.write(
                config.sourcemaps.write.dir,
                config.sourcemaps.write.options
            )
        )
        .pipe(gulp.dest(dist));
};

module.exports = CompileScript;
