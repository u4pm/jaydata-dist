'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Class.define('$data.dbClient.sqLiteNJClient.SqLiteNjCommand', _core2.default.dbClient.DbCommand, null, {
    constructor: function constructor(con, queryStr, params) {
        this.query = queryStr;
        this.connection = con;
        this.parameters = params;
    },
    executeNonQuery: function executeNonQuery(callback) {
        // TODO
        callback = _core2.default.PromiseHandlerBase.createCallbackSettings(callback);
        this.exec(this.query, this.parameters, callback.success, callback.error);
    },
    executeQuery: function executeQuery(callback) {
        callback = _core2.default.PromiseHandlerBase.createCallbackSettings(callback);
        this.exec(this.query, this.parameters, callback.success, callback.error);
    },
    exec: function exec(query, parameters, callback, errorhandler) {
        if (!this.connection.isOpen()) {
            this.connection.open();
        }
        if (parameters == null || parameters == undefined) {
            parameters = {};
        }
        var single = false;
        if (!(query instanceof Array)) {
            single = true;
            query = [query];
            parameters = [parameters];
        }

        var provider = this;
        var results = [];
        var remainingCommands = 0;
        var decClb = function decClb() {
            if (--remainingCommands == 0) {
                provider.connection.database.exec('COMMIT');
                callback(single ? results[0] : results);
            }
        };
        provider.connection.database.exec('BEGIN');
        query.forEach(function (q, i) {
            remainingCommands++;
            if (q) {
                var sqlClb = function sqlClb(error, rows) {
                    if (error != null) {
                        errorhandler(error);
                        return;
                    }
                    if (this.lastID) {
                        results[i] = { insertId: this.lastID, rows: [] };
                    } else {
                        results[i] = { rows: rows };
                    }
                    decClb();
                };

                var stmt = provider.connection.database.prepare(q, parameters[i]);
                if (q.indexOf('SELECT') == 0) {
                    stmt.all(sqlClb);
                } else {
                    stmt.run(sqlClb);
                }
                stmt.finalize();
            } else {
                results[i] = null;
                decClb();
            }
        }, this);
    }
}, null);