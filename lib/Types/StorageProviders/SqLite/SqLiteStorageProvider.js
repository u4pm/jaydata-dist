'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Class.define('$data.storageProviders.sqLite.SqLiteStorageProvider', _core2.default.StorageProviderBase, null, {
    constructor: function constructor(cfg, context) {
        this.SqlCommands = [];
        this.context = context;
        this.providerConfiguration = _core2.default.typeSystem.extend({
            databaseName: _core2.default.defaults.defaultDatabaseName,
            version: "",
            displayName: "JayData default db",
            maxSize: 1024 * 1024,
            dbCreation: _core2.default.storageProviders.DbCreationType.DropTableIfChanged
        }, cfg);

        this.providerName = '';
        for (var i in _core2.default.RegisteredStorageProviders) {
            if (_core2.default.RegisteredStorageProviders[i] === this.getType()) {
                this.providerName = i;
            }
        }

        if (this.context && this.context._buildDbType_generateConvertToFunction && this.buildDbType_generateConvertToFunction) {
            this.context._buildDbType_generateConvertToFunction = this.buildDbType_generateConvertToFunction;
        }
        if (this.context && this.context._buildDbType_modifyInstanceDefinition && this.buildDbType_modifyInstanceDefinition) {
            this.context._buildDbType_modifyInstanceDefinition = this.buildDbType_modifyInstanceDefinition;
        }
    },
    _createSqlConnection: function _createSqlConnection() {
        var ctorParm = {
            fileName: this.providerConfiguration.databaseName,
            version: "",
            displayName: this.providerConfiguration.displayName,
            maxSize: this.providerConfiguration.maxSize,
            storage: this.providerConfiguration.storage
        };

        if (this.connection) return this.connection;

        var connection = null;
        if (this.providerConfiguration.storage) {
            connection = new _core2.default.dbClient.jayStorageClient.JayStorageConnection(ctorParm);
        } else if (typeof sqLiteModule !== 'undefined') {
            connection = new _core2.default.dbClient.sqLiteNJClient.SqLiteNjConnection(ctorParm);
        } else {
            connection = new _core2.default.dbClient.openDatabaseClient.OpenDbConnection(ctorParm);
        }

        this.connection = connection;

        return connection;
    },

    supportedDataTypes: {
        value: [_core2.default.Array, _core2.default.Integer, _core2.default.String, _core2.default.Number, _core2.default.Blob, _core2.default.Array, _core2.default.Object, _core2.default.Boolean, _core2.default.Date, _core2.default.Guid, _core2.default.GeographyPoint, _core2.default.GeographyLineString, _core2.default.GeographyPolygon, _core2.default.GeographyMultiPoint, _core2.default.GeographyMultiLineString, _core2.default.GeographyMultiPolygon, _core2.default.GeographyCollection, _core2.default.GeometryPoint, _core2.default.GeometryLineString, _core2.default.GeometryPolygon, _core2.default.GeometryMultiPoint, _core2.default.GeometryMultiLineString, _core2.default.GeometryMultiPolygon, _core2.default.GeometryCollection, _core2.default.Byte, _core2.default.SByte, _core2.default.Decimal, _core2.default.Float, _core2.default.Int16, _core2.default.Int32, _core2.default.Int64, _core2.default.Time, _core2.default.DateTimeOffset, _core2.default.Duration, _core2.default.Day],
        writable: false
    },
    fieldConverter: { value: _core2.default.SqLiteConverter },

    supportedFieldOperations: {
        value: {
            length: {
                dataType: "number", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.ProjectionExpression]
            },
            substr: {
                dataType: "string",
                allowedIn: _core2.default.Expressions.FilterExpression,
                parameters: [{ name: "startFrom", dataType: "number" }, { name: "length", dataType: "number" }]
            },
            toLowerCase: {
                dataType: "string", mapTo: "lower"
            },
            toUpperCase: {
                dataType: "string", mapTo: "upper"
            },
            contains: {
                mapTo: "like",
                dataType: "boolean",
                allowedIn: _core2.default.Expressions.FilterExpression,
                parameters: [{ name: "strFragment", dataType: "string", prefix: "%", suffix: "%" }]
            },
            startsWith: {
                mapTo: "like",
                dataType: "boolean",
                allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.ProjectionExpression],
                parameters: [{ name: "strFragment", dataType: "string", suffix: "%" }]
            },
            endsWith: {
                mapTo: "like",
                dataType: "boolean",
                allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.ProjectionExpression],
                parameters: [{ name: "strFragment", dataType: "string", prefix: "%" }]
            },
            'trim': {
                dataType: _core2.default.String,
                allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.ProjectionExpression],
                mapTo: 'trim',
                parameters: [{ name: '@expression', dataType: _core2.default.String }, { name: 'chars', dataType: _core2.default.String }]
            },
            'ltrim': {
                dataType: _core2.default.String,
                allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.ProjectionExpression],
                mapTo: 'ltrim',
                parameters: [{ name: '@expression', dataType: _core2.default.String }, { name: 'chars', dataType: _core2.default.String }]
            },
            'rtrim': {
                dataType: _core2.default.String,
                allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.ProjectionExpression],
                mapTo: 'rtrim',
                parameters: [{ name: '@expression', dataType: _core2.default.String }, { name: 'chars', dataType: _core2.default.String }]
            }
        },
        enumerable: true,
        writable: true
    },

    supportedBinaryOperators: {
        value: {
            equal: { mapTo: '=', dataType: "boolean", nullMap: ' is null' },
            notEqual: { mapTo: '!=', dataType: "boolean", nullMap: ' is not null' },
            equalTyped: { mapTo: '=', dataType: "boolean", nullMap: ' is null' },
            notEqualTyped: { mapTo: '!=', dataType: "boolean", nullMap: ' is not null' },
            greaterThan: { mapTo: '>', dataType: "boolean" },
            greaterThanOrEqual: { mapTo: '>=', dataType: "boolean" },

            lessThan: { mapTo: '<', dataType: "boolean" },
            lessThenOrEqual: { mapTo: '<=', dataType: "boolean" },
            or: { mapTo: 'OR', dataType: "boolean" },
            and: { mapTo: 'AND', dataType: "boolean" },

            add: { mapTo: '+', dataType: "number" },
            divide: { mapTo: '/' },
            multiply: { mapTo: '*' },
            subtract: { mapTo: '-' },
            modulo: { mapTo: '%' },

            orBitwise: { maptTo: "|" },
            andBitwsise: { mapTo: "&" },

            "in": { mapTo: "in", dataType: "boolean" }
        }
    },

    supportedUnaryOperators: {
        value: {
            not: { mapTo: 'not' },
            positive: { mapTo: '+' },
            negative: { maptTo: '-' }
        }
    },

    supportedSetOperations: {
        value: {
            filter: {},
            map: {},
            length: {},
            forEach: {},
            toArray: {},
            single: {},
            take: {},
            skip: {},
            orderBy: {},
            orderByDescending: {},
            first: {},
            include: {}
        },
        enumerable: true,
        writable: true
    },

    supportedAutoincrementKeys: {
        value: {
            '$data.Integer': true,
            '$data.Int32': true,
            '$data.Guid': function $dataGuid() {
                return _core2.default.createGuid();
            }
        }
    },

    initializeStore: function initializeStore(callBack) {
        callBack = _core2.default.PromiseHandlerBase.createCallbackSettings(callBack);
        this.context._storageModel.filter(function (sm) {
            return !sm.IsComplexType;
        }).forEach(function (item, index) {
            this.SqlCommands.push(this.createSqlFromStorageModel(item) + " ");
        }, this);

        var sqlConnection = this._createSqlConnection();
        var cmd = sqlConnection.createCommand("SELECT * FROM sqlite_master WHERE type = 'table'", null);
        var that = this;

        cmd.executeQuery({
            success: function success(result) {
                var existObjectInDB = {};
                for (var i = 0; i < result.rows.length; i++) {
                    var item = result.rows[i];
                    existObjectInDB[item.tbl_name] = item;
                }
                switch (that.providerConfiguration.dbCreation) {
                    case _core2.default.storageProviders.DbCreationType.Merge:
                        _core.Guard.raise(new _core.Exception('Not supported db creation type'));
                        break;
                    case _core2.default.storageProviders.DbCreationType.DropTableIfChanged:
                        var deleteCmd = [];
                        for (var i = 0; i < that.SqlCommands.length; i++) {
                            if (that.SqlCommands[i] == "") {
                                continue;
                            }
                            var regEx = new RegExp('^CREATE TABLE IF NOT EXISTS ([^ ]*) (\\(.*\\))', 'g');
                            var data = regEx.exec(that.SqlCommands[i]);
                            if (data) {
                                var tableName = data[1];
                                var tableDef = data[2];
                                if (existObjectInDB[tableName.slice(1, tableName.length - 1)]) {
                                    var regex = new RegExp('\\(.*\\)', 'g');
                                    var existsRegExMatches = existObjectInDB[tableName.slice(1, tableName.length - 1)].sql.match(regex);

                                    if (!existsRegExMatches || tableDef.toLowerCase() != existsRegExMatches[0].toLowerCase()) {
                                        deleteCmd.push("DROP TABLE IF EXISTS [" + existObjectInDB[tableName.slice(1, tableName.length - 1)].tbl_name + "];");
                                    }
                                }
                            } else {
                                //console.dir(regEx);
                                //console.dir(that.SqlCommands[i]);
                            }
                        }
                        that.SqlCommands = that.SqlCommands.concat(deleteCmd);
                        //console.log(deleteCmd);
                        break;
                    case _core2.default.storageProviders.DbCreationType.DropAllExistingTables:
                        for (var objName in existObjectInDB) {
                            if (objName && !objName.match('^__') && !objName.match('^sqlite_')) {
                                that.SqlCommands.push("DROP TABLE IF EXISTS [" + existObjectInDB[objName].tbl_name + "];");
                            }
                        }
                        break;
                }
                that._runSqlCommands(sqlConnection, { success: callBack.success, error: callBack.error });
            },
            error: callBack.error
        });
    },
    executeQuery: function executeQuery(query, callBack) {
        callBack = _core2.default.PromiseHandlerBase.createCallbackSettings(callBack);
        var sqlConnection = this._createSqlConnection();
        var sql = this._compile(query);
        query.actionPack = sql.actions;
        query.sqlConvertMetadata = sql.converter;
        query.modelBinderConfig = sql.modelBinderConfig;
        var sqlCommand = sqlConnection.createCommand(sql.sqlText, sql.params);
        var that = this;
        sqlCommand.executeQuery({
            success: function success(sqlResult) {
                if (callBack.success) {
                    query.rawDataList = sqlResult.rows;
                    callBack.success(query);
                }
            },
            error: callBack.error
        });
    },
    _compile: function _compile(query, params) {
        var compiler = new _core2.default.storageProviders.sqLite.SQLiteCompiler();
        var compiled = compiler.compile(query);
        //console.dir(compiled);
        compiled.hasSelect = compiler.select != null;
        return compiled;
    },
    getTraceString: function getTraceString(query) {
        var sqlText = this._compile(query);
        return sqlText;
    },
    _runSqlCommands: function _runSqlCommands(sqlConnection, callBack) {
        if (this.SqlCommands && this.SqlCommands.length > 0) {
            var cmdStr = this.SqlCommands.pop();
            var command = sqlConnection.createCommand(cmdStr, null);
            var that = this;
            var okFn = function okFn(result) {
                that._runSqlCommands.apply(that, [sqlConnection, callBack]);
            };
            command.executeQuery({ success: okFn, error: callBack.error });
        } else {
            callBack.success(this.context);
        }
    },
    setContext: function setContext(ctx) {
        this.context = ctx;
    },
    saveChanges: function saveChanges(callback, changedItems) {
        var sqlConnection = this._createSqlConnection();
        var provider = this;
        var independentBlocks = this.buildIndependentBlocks(changedItems);
        this.saveIndependentBlocks(changedItems, independentBlocks, sqlConnection, callback);
    },
    saveIndependentBlocks: function saveIndependentBlocks(changedItems, independentBlocks, sqlConnection, callback) {
        /// <summary>
        /// Saves the sequentially independent items to the database.
        /// </summary>
        /// <param name="independentBlocks">Array of independent block of items.</param>
        /// <param name="sqlConnection">sqlConnection to use</param>
        /// <param name="callback">Callback on finish</param>
        var provider = this;
        var t = [].concat(independentBlocks);
        function saveNextIndependentBlock() {
            if (t.length === 0) {
                callback.success();
                return;
            }
            var currentBlock = t.shift();
            // Converting items to their physical equivalent (?)
            var convertedItems = currentBlock.map(function (item) {
                var dbType = provider.context._storageModel.getStorageModel(item.data.getType()).PhysicalType;
                item.physicalData = dbType.convertTo(item.data);
                return item;
            }, this);
            try {
                provider.saveIndependentItems(convertedItems, sqlConnection, {
                    success: function success() {
                        provider.postProcessItems(convertedItems);
                        saveNextIndependentBlock();
                    },
                    error: callback.error
                });
            } catch (e) {
                callback.error(e);
            }
        }
        saveNextIndependentBlock();
    },

    saveIndependentItems: function saveIndependentItems(items, sqlConnection, callback) {
        var provider = this;
        var queries = items.map(function (item) {
            return provider.saveEntitySet(item);
        });
        queries = queries.filter(function (item) {
            return item;
        });
        if (queries.length === 0) {
            callback.success(items);
            return;
        }
        function toCmd(sqlConnection, queries) {
            var cmdParams = { query: [], param: [] };
            queries.forEach(function (item, i) {
                if (item) {
                    if (item.query) cmdParams.query[i] = item.query;
                    if (item.param) cmdParams.param[i] = item.param;
                }
            });
            return sqlConnection.createCommand(cmdParams.query, cmdParams.param);
        }
        var cmd = toCmd(sqlConnection, queries);
        cmd.executeQuery({
            success: function success(results) {
                var reloadQueries = results.map(function (result, i) {
                    if (result && result.insertId) {
                        return provider.save_reloadSavedEntity(result.insertId, items[i].entitySet.tableName, sqlConnection);
                    } else {
                        return null;
                    }
                });
                var cmd = toCmd(sqlConnection, reloadQueries);
                if (cmd.query.length > 0) {
                    cmd.executeQuery(function (results) {
                        results.forEach(function (item, i) {
                            if (item && item.rows) {
                                items[i].physicalData.initData = item.rows[0];
                            }
                        });
                        callback.success(items);
                    });
                } else {
                    callback.success(0); //TODO Zenima: fixed this!
                }
            },
            error: callback.error
        });
    },
    postProcessItems: function postProcessItems(changedItems) {
        var pmpCache = {};
        function getPublicMappedProperties(type) {
            var key = type.name;
            if (pmpCache.hasOwnProperty(key)) return pmpCache[key];else {
                var pmp = type.memberDefinitions.getPublicMappedProperties().filter(function (memDef) {
                    return memDef.computed;
                });
                return pmpCache[key] = pmp;
            }
        }
        changedItems.forEach(function (item) {
            if (item.physicalData) {
                getPublicMappedProperties(item.data.getType()).forEach(function (memDef) {
                    item.data[memDef.name] = item.physicalData[memDef.name];
                }, this);
            }
        }, this);
    },

    saveEntitySet: function saveEntitySet(item) {
        switch (item.data.entityState) {
            case _core2.default.EntityState.Added:
                return this.save_NewEntity(item);break;
            case _core2.default.EntityState.Deleted:
                return this.save_DeleteEntity(item);break;
            case _core2.default.EntityState.Modified:
                return this.save_UpdateEntity(item);break;
            case _core2.default.EntityState.Unchanged:
                return;break;
            default:
                _core.Guard.raise(new _core.Exception('Not supported entity state'));
        }
    },
    save_DeleteEntity: function save_DeleteEntity(item) {
        ///DELETE FROM Posts WHERE Id=1;
        var deleteSqlString = "DELETE FROM [" + item.entitySet.tableName + "] WHERE(";
        var hasCondition = false;
        var addAllField = false;
        var deleteParam = [];
        while (!hasCondition) {
            item.physicalData.constructor.memberDefinitions.getPublicMappedProperties().forEach(function (fieldDef, i) {

                if (hasCondition && !deleteSqlString.match(" AND $")) {
                    deleteSqlString += " AND ";
                }
                if (fieldDef.key || addAllField) {
                    deleteSqlString += "([" + fieldDef.name + "] == ?)";
                    var logicalFieldDef = item.data.getType().memberDefinitions.getMember(fieldDef.name);
                    if (logicalFieldDef && logicalFieldDef.converter && logicalFieldDef.converter[this.providerName] && typeof logicalFieldDef.converter[this.providerName].toDb == 'function') {
                        deleteParam.push(logicalFieldDef.converter[this.providerName].toDb(item.data[logicalFieldDef.name], logicalFieldDef, this.context, logicalFieldDef.dataType));
                    } else {
                        deleteParam.push(this.fieldConverter.toDb[_core.Container.resolveName(fieldDef.dataType)](item.data[fieldDef.name]));
                    }
                    hasCondition = true;
                }
            }, this);
            if (!hasCondition) {
                addAllField = true;
            }
        }
        if (deleteSqlString.match(" AND $")) {
            deleteSqlString = deleteSqlString.slice(0, deleteSqlString.length - 5);
        }
        deleteSqlString += ");";
        return { query: deleteSqlString, param: deleteParam };
    },
    save_UpdateEntity: function save_UpdateEntity(item) {
        var setSection = " SET ";
        var whereSection = "WHERE(";

        var fieldsMaxIndex = item.entitySet.createNew.memberDefinitions.length;
        var hasCondition = false;
        var addAllField = false;
        var whereParam = [];
        var setParam = [];
        item.physicalData.constructor.memberDefinitions.getPublicMappedProperties().forEach(function (fieldDef, i) {
            if (item.physicalData[fieldDef.name] !== undefined) {
                if (hasCondition && !whereSection.match(" AND $")) {
                    whereSection += " AND ";
                }
                if (setSection.length > 5 && !setSection.match(',$')) {
                    setSection += ',';
                }
                if (fieldDef.key) {
                    whereSection += '([' + fieldDef.name + '] == ?)';
                    var logicalFieldDef = item.data.getType().memberDefinitions.getMember(fieldDef.name);
                    if (logicalFieldDef && logicalFieldDef.converter && logicalFieldDef.converter[this.providerName] && typeof logicalFieldDef.converter[this.providerName].toDb == 'function') {
                        whereParam.push(logicalFieldDef.converter[this.providerName].toDb(item.physicalData[logicalFieldDef.name], fieldDef, this.context, logicalFieldDef.dataType));
                    } else {
                        whereParam.push(this.fieldConverter.toDb[_core.Container.resolveName(fieldDef.dataType)](item.physicalData[fieldDef.name]));
                    }
                    hasCondition = true;
                } else {
                    setSection += "[" + fieldDef.name + "] = ?";
                    var logicalFieldDef = item.data.getType().memberDefinitions.getMember(fieldDef.name);
                    if (logicalFieldDef && logicalFieldDef.converter && logicalFieldDef.converter[this.providerName] && typeof logicalFieldDef.converter[this.providerName].toDb == 'function') {
                        setParam.push(fieldDef.converter[this.providerName].toDb(item.physicalData[logicalFieldDef.name], logicalFieldDef, this.context, logicalFieldDef.dataType));
                    } else {
                        setParam.push(this.fieldConverter.toDb[_core.Container.resolveName(fieldDef.dataType)](item.physicalData[fieldDef.name]));
                    }
                }
            }
        }, this);
        if (!hasCondition) {
            _core.Guard.raise(new _core.Exception('Not supported UPDATE function without primary key!'));
        }

        if (whereSection.match(" AND $")) {
            whereSection = whereSection.slice(0, whereSection.length - 5);
        }
        if (setSection.match(",$")) {
            setSection = setSection.slice(0, setSection.length - 1);
        }
        var updateSqlString = "UPDATE [" + item.entitySet.tableName + "]" + setSection + " " + whereSection + ");";
        return { query: updateSqlString, param: setParam.concat(whereParam) };
    },
    save_NewEntity: function save_NewEntity(item) {
        var insertSqlString = "INSERT INTO [" + item.entitySet.tableName + "](";
        var fieldList = "";
        var fieldValue = "";
        var fieldParam = [];
        item.physicalData.constructor.memberDefinitions.getPublicMappedProperties().forEach(function (fieldDef, i) {
            if (fieldDef.key && !fieldDef.computed && _core.Guard.isNullOrUndefined(item.physicalData[fieldDef.name])) {
                _core.Guard.raise(new _core.Exception('Key is not set', 'Value exception', item));
                return;
            }
            if (fieldDef.key && fieldDef.computed && _core.Guard.isNullOrUndefined(item.physicalData[fieldDef.name])) {
                var typeName = _core.Container.resolveName(fieldDef.type);
                if (typeof this.supportedAutoincrementKeys[typeName] === 'function') {
                    item.physicalData[fieldDef.name] = this.supportedAutoincrementKeys[typeName]();
                }
            }

            if (fieldList.length > 0 && fieldList[fieldList.length - 1] != ",") {
                fieldList += ",";fieldValue += ",";
            }
            var fieldName = fieldDef.name;
            if ( /*item.physicalData[fieldName] !== null && */item.physicalData[fieldName] !== undefined) {
                if (fieldDef.dataType && (!fieldDef.dataType.isAssignableTo || fieldDef.dataType.isAssignableTo && !fieldDef.dataType.isAssignableTo(_core2.default.EntitySet))) {
                    fieldValue += '?';
                    fieldList += "[" + fieldName + "]";
                    var logicalFieldDef = item.data.getType().memberDefinitions.getMember(fieldDef.name);
                    if (logicalFieldDef && logicalFieldDef.converter && logicalFieldDef.converter[this.providerName] && typeof logicalFieldDef.converter[this.providerName].toDb == 'function') {
                        fieldParam.push(logicalFieldDef.converter[this.providerName].toDb(item.physicalData[fieldName], logicalFieldDef, this.context, logicalFieldDef.dataType));
                    } else {
                        fieldParam.push(this.fieldConverter.toDb[_core.Container.resolveName(fieldDef.dataType)](item.physicalData[fieldName]));
                    }
                }
            }
        }, this);
        if (fieldParam.length < 1) {
            insertSqlString = "INSERT INTO [" + item.entitySet.tableName + "] Default values";
        } else {
            if (fieldList[fieldList.length - 1] == ",") {
                fieldList = fieldList.slice(0, fieldList.length - 1);
            }
            if (fieldValue[fieldValue.length - 1] == ",") {
                fieldValue = fieldValue.slice(0, fieldValue.length - 1);
            }
            insertSqlString += fieldList + ") VALUES(" + fieldValue + ");";
        }
        return { query: insertSqlString, param: fieldParam };
    },
    save_reloadSavedEntity: function save_reloadSavedEntity(rowid, tableName) {
        return { query: "SELECT * FROM " + tableName + " WHERE rowid=?", param: [rowid] };
    },
    createSqlFromStorageModel: function createSqlFromStorageModel(memberDef) {
        ///<param name="memberDef" type="$data.StorageModel">StorageModel object wich contains physical entity definition</param>
        if (memberDef === undefined || memberDef === null || memberDef.PhysicalType === undefined) {
            _core.Guard.raise("StorageModel not contains physical entity definition");
        }

        var keyFieldNumber = 0;
        var autoincrementFieldNumber = 0;

        memberDef.PhysicalType.memberDefinitions.getPublicMappedProperties().forEach(function (item, index) {

            if (item.key) {
                keyFieldNumber++;
            }
            if (item.computed) {
                //if (!item.key) {
                //    Guard.raise(new Exception('Only key field can be computed field!'));
                //}
                autoincrementFieldNumber++;
            }
        }, this);

        if (autoincrementFieldNumber === 1 && keyFieldNumber > 1) {
            _core.Guard.raise(new _core.Exception('Do not use computed field with multiple primary key!'));
        }
        if (autoincrementFieldNumber > 1 && keyFieldNumber > 1) {
            _core.Guard.raise(new _core.Exception('Do not use multiple computed field!'));
        }

        memberDef.PhysicalType.memberDefinitions.getKeyProperties().forEach(function (item, index) {
            var typeName = _core.Container.resolveName(item.type);
            if (item.computed && !(typeName in this.supportedAutoincrementKeys)) {
                console.log("WARRNING! '" + typeName + "' not supported as computed Key!");
            }
        }, this);

        var sql = "CREATE TABLE IF NOT EXISTS [" + memberDef.TableName + "] (";
        var pkFragment = ',PRIMARY KEY (';

        memberDef.PhysicalType.memberDefinitions.getPublicMappedProperties().forEach(function (item, index) {

            if (index > 0 && !sql.match(', $') && !sql.match('\\($')) sql += ', ';
            //var field = memberDef.createNew.memberDefinitions[fieldIndex];
            sql += this.createSqlFragmentFromField(item, autoincrementFieldNumber === 1, memberDef);
            if (autoincrementFieldNumber === 0 && item.key) {
                if (pkFragment.length > 14 && !pkFragment.match(', $')) pkFragment += ', ';
                pkFragment += "[" + item.name + "]";
            }
        }, this);

        if (sql.match(', $')) sql = sql.substr(0, sql.length - 2);
        if (autoincrementFieldNumber === 0 && pkFragment.length > 14) {
            sql += pkFragment + ')';
        }
        sql += ');';
        return sql;
    },
    createSqlFragmentFromField: function createSqlFragmentFromField(field, parsePk, storageModelObject) {
        if ('schemaCreate' in field && field['schemaCreate']) return field.schemaCreate(field);

        var fldBuilder = new this.FieldTypeBuilder(field, this, parsePk, storageModelObject);
        return fldBuilder.build();
    },
    FieldTypeBuilder: function FieldTypeBuilder(field, prov, parseKey, storageModelObject) {
        this.fieldDef = "";
        this.fld = field;
        this.provider = prov;
        this.parsePk = parseKey;
        this.entitySet = storageModelObject;
        this.build = function () {

            var typeName = _core.Container.resolveName(this.fld.dataType);
            var mapping = _core2.default.SqLiteFieldMapping[typeName];

            if (mapping) {
                this.buildFieldNameAndType(mapping);
            } else {
                this.buildRelations();
            }

            return this.fieldDef;
        };
        this.buildFieldNameAndType = function (type) {
            this.fieldDef = "[" + this.fld.name + "] " + type;
            this.parsePk ? this.buildPrimaryKey() : this.buildNotNull();
        };
        this.buildPrimaryKey = function () {
            if (this.fld.key) {
                this.fieldDef += " PRIMARY KEY";

                var typeName = _core.Container.resolveName(this.fld.dataType);
                if (this.provider.supportedAutoincrementKeys[typeName] === true) {
                    this.buildAutoIncrement();
                }
            } else {
                this.buildNotNull();
            }
        };
        this.buildNotNull = function () {
            if (this.fld.required) this.fieldDef += " NOT NULL";
        };
        this.buildAutoIncrement = function () {
            if (this.fld.computed) this.fieldDef += " AUTOINCREMENT";
        };
    }
}, {
    isSupported: {
        get: function get() {
            return "openDatabase" in _core2.default.__global;
        },
        set: function set() {}
    }
});

if (_core2.default.storageProviders.sqLite.SqLiteStorageProvider.isSupported) {
    _core2.default.StorageProviderBase.registerProvider("webSql", _core2.default.storageProviders.sqLite.SqLiteStorageProvider);
    _core2.default.StorageProviderBase.registerProvider("sqLite", _core2.default.storageProviders.sqLite.SqLiteStorageProvider);
    _core2.default.webSqlProvider = _core2.default.storageProviders.sqLite.SqLiteStorageProvider;
}