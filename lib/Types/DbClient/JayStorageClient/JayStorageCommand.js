'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Class.define('$data.dbClient.jayStorageClient.JayStorageCommand', _core2.default.dbClient.DbCommand, null, {
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
        var remainingCommands = query.length;
        var decClb = function decClb() {
            if (--remainingCommands == 0) {
                callback(single ? results[0] : results);
            }
        };

        query.forEach(function (q, i) {
            if (q) {
                _core2.default.ajax({
                    url: 'http' + (this.connection.connectionParams.storage.ssl ? 's' : '') + '://' + this.connection.connectionParams.storage.src.replace('http://', '').replace('https://', '') + '?db=' + this.connection.connectionParams.storage.key,
                    type: 'POST',
                    headers: {
                        'X-PINGOTHER': 'pingpong'
                    },
                    data: { query: q, parameters: parameters[i] },
                    dataType: 'json',
                    contentType: 'application/json;charset=UTF-8',
                    success: function success(data) {
                        if (data && data.error) {
                            console.log('JayStorage error', data.error);
                            errorhandler(data.error);
                            return;
                        }
                        if (this.lastID) {
                            results[i] = { insertId: this.lastID, rows: (data || { rows: [] }).rows };
                        } else results[i] = { rows: (data || { rows: [] }).rows };
                        decClb();
                    }
                });
            } else {
                results[i] = null;
                decClb();
            }
        }, this);
    }
}, null);