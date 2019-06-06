'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof WinJS !== 'undefined' && WinJS.xhr) {
    _index2.default.ajax = _index2.default.ajax || function (options) {
        _index2.default.typeSystem.extend(options, {
            dataType: 'json',
            headers: {}
        });
        var dataTypes = {
            'json': {
                accept: 'application/json, text/javascript',
                convert: JSON.parse
            },
            'text': {
                accept: 'text/plain',
                convert: function convert(e) {
                    return e;
                }
            },
            'html': {
                accept: 'text/html',
                convert: function convert(e) {
                    return e;
                }
            },
            'xml': {
                accept: 'application/xml, text/xml',
                convert: function convert(e) {
                    // TODO?
                    return e;
                }
            }
        };
        var dataTypeContext = dataTypes[options.dataType.toLowerCase()];

        options.headers.Accept = dataTypeContext.accept;

        var successClb = options.success || _index2.default.defaultSuccessCallback;
        var errorClb = options.error || _index2.default.defaultErrorCallback;
        var progressClb = options.progress;

        var success = function success(r) {
            var result = dataTypeContext.convert(r.responseText);
            successClb(result);
        };
        var error = function error(r) {
            var error = dataTypeContext.convert(r.responseText);
            errorClb(error);
        };
        var progress = progressClb;

        WinJS.xhr(options).done(success, error, progress);
    };
}

exports.default = _index2.default;
module.exports = exports['default'];