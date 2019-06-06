'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Class.define('$data.dbClient.openDatabaseClient.OpenDbConnection', _core2.default.dbClient.DbConnection, null, {
    constructor: function constructor(params) {
        this.connectionParams = params;
    },
    isOpen: function isOpen() {
        return this.database !== null && this.database !== undefined && this.transaction !== null && this.transaction !== undefined;
    },
    open: function open(callBack, tran, isWrite) {
        if (isWrite === undefined) isWrite = true;

        callBack.oncomplete = callBack.oncomplete || function () {};
        if (tran) {
            callBack.success(tran.transaction);
        } else if (this.database) {
            if (isWrite) {
                this.database.transaction(function (tran) {
                    callBack.success(tran);
                }, callBack.error, callBack.oncomplete);
            } else {
                this.database.readTransaction(function (tran) {
                    callBack.success(tran);
                }, callBack.error, callBack.oncomplete);
            }
        } else {
            var p = this.connectionParams;
            var con = this;
            this.database = openDatabase(p.fileName, p.version, p.displayName, p.maxSize);
            if (!this.database.readTransaction) {
                this.database.readTransaction = function () {
                    con.database.transaction.apply(con.database, arguments);
                };
            }

            if (isWrite) {
                this.database.transaction(function (tran) {
                    callBack.success(tran);
                }, callBack.error, callBack.oncomplete);
            } else {
                this.database.readTransaction(function (tran) {
                    callBack.success(tran);
                }, callBack.error, callBack.oncomplete);
            }
        }
    },
    close: function close() {
        this.transaction = undefined;
        this.database = undefined;
    },
    createCommand: function createCommand(queryStr, params) {
        var cmd = new _core2.default.dbClient.openDatabaseClient.OpenDbCommand(this, queryStr, params);
        return cmd;
    }
}, null);