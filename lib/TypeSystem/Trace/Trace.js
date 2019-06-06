'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _TypeSystem = require('../TypeSystem.js');

var _TypeSystem2 = _interopRequireDefault(_TypeSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_TypeSystem2.default.Class.define('$data.TraceBase', null, null, {
    log: function log() {},
    warn: function warn() {},
    error: function error() {}
});

_TypeSystem2.default.Trace = new _TypeSystem2.default.TraceBase();

exports.default = _TypeSystem2.default;
module.exports = exports['default'];