'use strict';

var _core = require('../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Class.define('$data.dbClient.DbCommand', null, null, {
    connection: {},
    parameters: {},
    execute: function execute(callback) {
        _core.Guard.raise("Pure class");
    }
}, null);