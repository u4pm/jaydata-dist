'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.EntityState = {
    Detached: 0,
    Unchanged: 10,
    Added: 20,
    Modified: 30,
    Deleted: 40
};

exports.default = _index2.default;
module.exports = exports['default'];