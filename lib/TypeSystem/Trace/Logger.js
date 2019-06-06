'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _TypeSystem = require('../TypeSystem.js');

var _TypeSystem2 = _interopRequireDefault(_TypeSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_TypeSystem2.default.Class.define('$data.Logger', _TypeSystem2.default.TraceBase, null, {
    log: function log() {
        Array.prototype.unshift.call(arguments, this.getDateFormat());
        console.log.apply(console, arguments);
    },
    warn: function warn() {
        Array.prototype.unshift.call(arguments, this.getDateFormat());
        console.warn.apply(console, arguments);
    },
    error: function error() {
        Array.prototype.unshift.call(arguments, this.getDateFormat());
        console.error.apply(console, arguments);
    },

    getDateFormat: function getDateFormat() {
        var date = new Date();
        return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds();
    }
});

exports.default = _TypeSystem2.default;
module.exports = exports['default'];