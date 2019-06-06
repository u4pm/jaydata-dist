'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Base.extend('$data.EntityWrapper', {
    getEntity: function getEntity() {
        _index.Guard.raise("pure object");
    }
});

exports.default = _index2.default;
module.exports = exports['default'];