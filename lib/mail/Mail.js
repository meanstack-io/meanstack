/**
 * Mail
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
var nodemailer = require('nodemailer'),
    EmailTemplate = require('email-templates').EmailTemplate,
    mergeConfig = require('../support/MergeObject'),
    path = require('path');

/**
 * Mail
 *
 * @param App
 * @constructor
 */
var Mail = function (App) {
    this._config = App.config.get('mail');
};

/**
 * configSmtp
 *
 * @param settings
 * @returns {*}
 */
Mail.prototype.configSmtp = function (settings) {
    var config = this._config;

    return mergeConfig({
            host: config.smtp.host,
            secure: config.smtp.secure,
            port: config.smtp.port,
            auth: {
                user: config.smtp.auth.user,
                pass: config.smtp.auth.pass
            },
            logger: config.smtp.logger,
            debug: config.smtp.debug
        },
        settings || {}
    );
};

/**
 * Create transport.
 *   Documentation Nodemailer: https://github.com/nodemailer/nodemailer#transports
 *
 * @param settings
 */
Mail.prototype.smtp = function (settings) {
    return nodemailer.createTransport(this.configSmtp(settings));
};

/**
 * mailOptions
 *
 * @param options
 * @returns {*}
 */
Mail.prototype.mailOptions = function (options) {
    var config = this._config;

    return mergeConfig(
        {
            from: config.smtp.from
        },
        options || {}
    );
};

/**
 * sendMail.
 *   Documentation Nodemailer: https://github.com/nodemailer/nodemailer
 *
 */
Mail.prototype.sendMail = function (mailOptions, settings) {
    return this.smtp(settings).sendMail(this.mailOptions(mailOptions));
};

/**
 * Generate template
 *   Documentation email-templates: https://github.com/crocodilejs/node-email-templates
 *
 * @param template
 * @param options
 * @returns {*}
 */
Mail.prototype.template = function (template, options) {
    var config = this._config;

    return new EmailTemplate(
        path.join(config.template.path, template),
        mergeConfig(
            config.template.options || {},
            options || {}
        )
    );
};

module.exports = Mail;
