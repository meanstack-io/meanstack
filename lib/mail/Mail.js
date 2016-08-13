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
 * configSmtpFrom
 *
 * @returns {{from: *}}
 */
Mail.prototype.configSmtpFrom = function () {
    var self = this;

    return {
        from: self._config.smtp.from
    };
};

/**
 * configSmtp
 *
 * @param settings
 * @returns {*}
 */
Mail.prototype.configSmtp = function (settings) {
    var config = this._config;

    return Object.assign(
        {},
        {
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
 * @param settings
 * @param settings2
 * @returns {*}
 */
Mail.prototype.mailOptions = function (settings, settings2) {
    return Object.assign(
        {},
        this.configSmtpFrom(),
        settings || {},
        settings2 || {}
    );
};

/**
 * Generate template
 *   Documentation email-templates: https://github.com/crocodilejs/node-email-templates
 *
 * @param template
 * @returns {*}
 */
Mail.prototype.template = function (template) {
    var config = this._config;
    config.template.options = config.template.options || {};

    return new EmailTemplate(path.join(config.template, template), config.template.options);
};

module.exports = Mail;
