'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof jQuery !== 'undefined' && jQuery.ajax) {
    _index2.default.ajax = _index2.default.ajax || jQuery.ajax;
}

exports.default = _index2.default;
module.exports = exports['default'];