'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function ($data) {

    $data.initService = function (apiKey, options) {
        var d = new $data.PromiseHandler();
        var cfg;

        if ((typeof apiKey === 'undefined' ? 'undefined' : _typeof(apiKey)) === 'object') {
            //appId, serviceName, ownerid, isSSL, port, license, url
            cfg = apiKey;
            var protocol = cfg.isSSL || cfg.isSSL === undefined ? 'https' : 'http';
            var port = cfg.port ? ':' + cfg.port : '';

            if (typeof cfg.license === 'string' && cfg.license.toLowerCase() === 'business') {
                if (cfg.appId && cfg.serviceName) {
                    apiKey = protocol + '://' + cfg.appId + '.jaystack.net' + port + '/' + cfg.serviceName;
                } else {
                    apiKey = cfg.url;
                }
            } else {
                if (cfg.ownerId && cfg.appId && cfg.serviceName) {
                    apiKey = protocol + '://open.jaystack.net/' + cfg.ownerId + '/' + cfg.appId + '/api/' + cfg.serviceName;
                } else {
                    apiKey = cfg.url;
                }
            }

            delete cfg.url;
            cfg = $data.typeSystem.extend(cfg, options);
        } else {
            cfg = options;
        }

        $data.service(apiKey, cfg).then(function (factory) {
            var ctx = factory();
            return ctx.onReady().then(function (context) {
                context.serviceFactory = factory;
                d.deferred.resolve(context, factory, factory.type);
            }).fail(function () {
                d.deferred.reject.apply(d.deferred, arguments);
            });
        }).fail(function () {
            d.deferred.reject.apply(d.deferred, arguments);
        });

        return d.getPromise();
    };
})(_index2.default);

exports.default = _index2.default;
module.exports = exports['default'];