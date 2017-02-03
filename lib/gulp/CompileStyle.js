/**
 * Compile style.
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
 * CompileStyle
 *
 * @param src
 * @param dist
 * @param options
 */
var CompileStyle = function (src, dist, options) {
    var config = mergeObject(
        {
            autoprefixer: {browsers: ['last 2 versions']},
            engine: 'sass',
            sassGlob: {},
            sass: {},
            less: {},
            cleanCss: {},
            concat: false,
            name: 'style.css',
            rename: {
                suffix: '.min'
            },
            sourcemaps: {
                init: {
                    loadMaps: true
                },
                write: {
                    dir: null,
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
        options || {}
    );

    var compileStylePipe = lazypipe()
        .pipe(function () {
            return $.if(
                config.engine === 'sass',
                $.sassGlob(config.sassGlob)
            );
        })
        .pipe(function () {
            return $.if(
                config.engine === 'sass',
                $.sass(config.sass)
            );
        })
        .pipe(function () {
            return $.if(
                config.engine === 'less',
                $.less(config.less)
            );
        });

    var productionPipe = lazypipe()
        .pipe($.rename, config.rename)
        .pipe($.cleanCss, config.cleanCss);

    return gulp.src(src)
        .pipe($.sourcemaps.init(config.sourcemaps.init))
        .pipe($.plumber(config.plumber))
        .pipe(compileStylePipe())
        .pipe($.autoprefixer(config.autoprefixer))
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

module.exports = CompileStyle;
