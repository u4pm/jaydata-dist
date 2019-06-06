'use strict';

var _core = require('../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Class.define('$data.dbClient.DbConnection', null, null, {
    connectionParams: {},
    database: {},
    isOpen: function isOpen() {
        _core.Guard.raise("Pure class");
    },
    open: function open() {
        _core.Guard.raise("Pure class");
    },
    close: function close() {
        _core.Guard.raise("Pure class");
    },
    createCommand: function createCommand() {
        _core.Guard.raise("Pure class");
    }
}, null);