'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Class.define('$data.dbClient.sqLiteNJClient.SqLiteNjConnection', _core2.default.dbClient.DbConnection, null, {
    constructor: function constructor(params) {
        this.connectionParams = params;
    },
    isOpen: function isOpen() {
        return this.database !== null && this.database !== undefined;
    },
    open: function open() {
        if (this.database == null) {
            var p = this.connectionParams;
            this.database = new sqLiteModule.Database(p.fileName);
        }
    },
    close: function close() {
        //not supported yet (performance issue)
    },
    createCommand: function createCommand(queryStr, params) {
        var cmd = new _core2.default.dbClient.sqLiteNJClient.SqLiteNjCommand(this, queryStr, params);
        return cmd;
    }
}, null);