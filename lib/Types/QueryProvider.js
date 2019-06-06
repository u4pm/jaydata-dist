'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define('$data.QueryProvider', null, null, {
    //TODO: instance member?????
    constructor: function constructor() {
        this.requiresExpressions = false;
    },
    executeQuery: function executeQuery(queryable, resultHandler) {},
    getTraceString: function getTraceString(queryable) {}
}, null);

exports.default = _index2.default;
module.exports = exports['default'];