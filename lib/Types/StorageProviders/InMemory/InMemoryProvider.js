'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.storageProviders.InMemory.InMemoryProvider', _core2.default.StorageProviderBase, null, {
    constructor: function constructor(cfg, ctx) {
        this.context = ctx;
        this.providerConfiguration = _core2.default.typeSystem.extend({
            source: null,
            persistentData: false,
            //obsolate
            localStoreName: 'JayData_InMemory_Provider',
            databaseName: 'JayData_InMemory_Provider',
            __instaceId: _core2.default.createGuid().toString()
        }, cfg);

        this.dataSource = this.providerConfiguration.source;
        delete this.providerConfiguration.source;

        if (this.providerConfiguration.databaseName === 'JayData_InMemory_Provider') this.providerConfiguration.databaseName = this.providerConfiguration.localStoreName;
    },
    initializeStore: function initializeStore(callBack) {
        callBack = _core2.default.PromiseHandlerBase.createCallbackSettings(callBack);

        var setKeys = [];
        for (var i in this.context._entitySetReferences) {
            setKeys.push(this.context._entitySetReferences[i].collectionName);
        }
        var localStorageData = null;
        if (this.providerConfiguration.persistentData && _core2.default.__global.localStorage && this.providerConfiguration.dbCreation !== _core2.default.storageProviders.DbCreationType.DropAllExistingTables) {
            var localStoreName = this.providerConfiguration.databaseName || "JayData_InMemory_Provider";
            var that = this;
            var storeData = _core2.default.__global.localStorage.getItem(localStoreName);

            if (!_core.Guard.isNullOrUndefined(storeData)) {
                localStorageData = JSON.parse(storeData, function (key, value) {
                    if (setKeys.indexOf(key) > -1 && value.map) {
                        return value.map(function (item) {
                            return new that.context[key].createNew(item);
                        });
                    }
                    return value;
                });
            }
        }

        var tempSource = localStorageData || this.dataSource || {};

        //check data and crate sequence table if needed
        this.dataSource = { 'inmemory_sequence': {} };
        for (var index = 0; index < this.context._storageModel.length; index++) {
            var storageModel = this.context._storageModel[index];
            if (storageModel.IsComplexType) continue;
            //Create store for EntitySet
            this.dataSource[storageModel.TableName] = [];
            //Check primary key
            var keys = storageModel.LogicalType.memberDefinitions.getKeyProperties();
            var computedKeys = keys.filter(function (key) {
                return key.computed;
            });
            if (computedKeys.length > 1) {
                _core.Guard.raise(new _core.Exception('More than one computed field not supported in ' + storageModel.TableName + ' entity set.'));
            }
            var isIntegerPk = false;
            if (computedKeys.length === 1) {
                var resolvedType = _core.Container.resolveName(computedKeys[0].type);
                if (this.supportedAutoincrementKeys[resolvedType] === true) {
                    //if(resolvedType === $data.Integer){
                    this.dataSource['inmemory_sequence'][storageModel.TableName] = 0;
                    isIntegerPk = true;
                } else if (typeof this.supportedAutoincrementKeys[resolvedType] === 'function') {
                    //}else if (resolvedType === $data.Guid){

                } else {
                    console.log("WARRNING! '" + resolvedType + "' not supported as computed Key!");
                    //Guard.raise(new Exception('Not supported key field type. Computed pk field type are $data.Integer or $data.Guid!', 'ComputedKeyFieldError'));
                }
            }
            //validate init data
            if (tempSource[storageModel.TableName]) {
                for (var i = 0; i < tempSource[storageModel.TableName].length; i++) {
                    var entity = tempSource[storageModel.TableName][i];
                    if (!(entity instanceof storageModel.LogicalType)) {
                        if (localStorageData) {
                            entity = new storageModel.LogicalType(entity);
                        } else {
                            _core.Guard.raise(new _core.Exception('Invalid element in source: ' + storageModel.TableName));
                        }
                    }

                    if (isIntegerPk) {
                        var keyValue = entity[computedKeys[0].name];
                        if (keyValue > this.dataSource['inmemory_sequence'][storageModel.TableName]) {
                            this.dataSource['inmemory_sequence'][storageModel.TableName] = keyValue;
                        }
                    }
                    this.dataSource[storageModel.TableName].push(entity);
                }
            }
        }
        callBack.success(this.context);
    },
    executeQuery: function executeQuery(query, callBack) {
        callBack = _core2.default.PromiseHandlerBase.createCallbackSettings(callBack);

        var sql;
        try {
            sql = this._compile(query);
        } catch (e) {
            callBack.error(e);
            return;
        }
        var sourceName = query.context.getEntitySetFromElementType(query.defaultType).tableName;
        var result = [].concat(this.dataSource[sourceName] || []);
        if (sql.$filter && !sql.$every) result = result.filter(sql.$filter);

        if (sql.$map && Object.keys(query.modelBinderConfig).length === 0) result = result.map(sql.$map);

        if (sql.$order && sql.$order.length > 0) {
            result.sort(function (a, b) {
                var result;
                for (var i = 0, l = sql.$order.length; i < l; i++) {
                    result = 0;
                    var aVal = sql.$order[i](a);
                    var bVal = sql.$order[i](b);

                    if (sql.$order[i].ASC) result = aVal === bVal ? 0 : aVal > bVal || bVal === null ? 1 : -1;else result = aVal === bVal ? 0 : aVal < bVal || aVal === null ? 1 : -1;

                    if (result !== 0) break;
                }
                return result;
            });
        }

        if (sql.$take !== undefined && sql.$skip !== undefined) {
            result = result.slice(sql.$skip, sql.$skip + sql.$take);
        } else if (sql.$take !== undefined && result.length > sql.$take) {
            result = result.slice(0, sql.$take);
        } else if (sql.$skip) {
            result = result.slice(sql.$skip, result.length);
        }

        if (sql.$some) result = [result.length > 0];

        //        if (sql.$every && sql.$filter)
        //            result = [result.every(sql.$filter)];

        if (sql.$length) result = [result.length];

        query.rawDataList = result;
        callBack.success(query);
    },
    _compile: function _compile(query, params) {
        var compiler = new _core2.default.storageProviders.InMemory.InMemoryCompiler(this);
        var compiled = compiler.compile(query);
        return compiled;
    },
    saveChanges: function saveChanges(callBack, changedItems) {
        for (var i = 0; i < changedItems.length; i++) {
            var item = changedItems[i];
            switch (item.data.entityState) {
                case _core2.default.EntityState.Added:
                    this._save_add_processPk(item);
                    this.dataSource[item.entitySet.tableName].push(item.data);
                    break;
                case _core2.default.EntityState.Deleted:
                    var collection = this.dataSource[item.entitySet.tableName];
                    var entity = this._save_getEntity(item, collection);
                    var idx = collection.indexOf(entity);
                    collection.splice(idx, 1);
                    break;
                case _core2.default.EntityState.Modified:
                    if (item.data.changedProperties && item.data.changedProperties.length > 0) {
                        var collection = this.dataSource[item.entitySet.tableName];
                        var entity = this._save_getEntity(item, collection);
                        for (var j = 0; j < item.data.changedProperties.length; j++) {
                            var field = item.data.changedProperties[j];
                            if (!field.key && item.entitySet.elementType.memberDefinitions.getPublicMappedPropertyNames().indexOf(field.name) > -1) {
                                entity[field.name] = item.data[field.name];
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        if (this.providerConfiguration.persistentData && _core2.default.__global.localStorage) {
            var localStoreName = this.providerConfiguration.databaseName || "JayData_InMemory_Provider";

            var that = this;
            var setKeys = [];
            for (var i in this.context._entitySetReferences) {
                setKeys.push(this.context._entitySetReferences[i].collectionName);
            }
            var localStorageData = _core2.default.__global.localStorage.setItem(localStoreName, JSON.stringify(this.dataSource, function (key, value) {
                if (setKeys.indexOf(key) > -1 && Array.isArray(value)) {
                    var data = [];
                    for (var i = 0; i < value.length; i++) {
                        var dataItem = {};
                        that.context[key].elementType.memberDefinitions.getPublicMappedProperties().forEach(function (memDef) {
                            if (!memDef.inverseProperty) {
                                var typeName = _core.Container.resolveName(memDef.type);
                                var converter = that.fieldConverter.fromDb[typeName];
                                dataItem[memDef.name] = converter ? converter(value[i][memDef.name]) : value[i][memDef.name];
                            }
                        });
                        data.push(dataItem);
                    }
                    return data;
                }
                return value;
            }));
        }
        callBack.success();
    },
    _save_add_processPk: function _save_add_processPk(item) {
        var keys = item.entitySet.elementType.memberDefinitions.getKeyProperties();
        if (keys.length === 1 && keys[0].computed) {
            var key = keys[0];
            var keyResolveType = _core.Container.resolveName(key.type);
            //if(keyResolveType === $data.Guid){
            if (typeof this.supportedAutoincrementKeys[keyResolveType] === 'function') {
                item.data[key.name] = this.supportedAutoincrementKeys[keyResolveType]();
            } else if (this.supportedAutoincrementKeys[keyResolveType] === true) {
                var sequenceValue = this.dataSource['inmemory_sequence'][item.entitySet.tableName];
                item.data[key.name] = sequenceValue + 1;
                this.dataSource['inmemory_sequence'][item.entitySet.tableName] = sequenceValue + 1;
                //}else{
                //    Guard.raise(new Exception("Not supported data type!"))
            }
        } else {
            for (var j = 0; j < keys.length; j++) {
                if (item.data[keys[j].name] === null || item.data[keys[j].name] === undefined) {
                    _core.Guard.raise(new _core.Exception('Key field must set value! Key field name without value: ' + keys[j].name));
                }
            }
        }
    },
    _save_getEntity: function _save_getEntity(item, collection) {
        var keys = item.entitySet.elementType.memberDefinitions.getKeyProperties();
        var entities = collection.filter(function (entity) {
            var isEqual = true;
            for (var i = 0; i < keys.length; i++) {
                isEqual = isEqual && entity[keys[i].name] === item.data[keys[i].name];
            }
            return isEqual;
        });
        if (entities > 1) {
            _core.Guard.raise(new _core.Exception("Inconsistent storage!"));
        }
        return entities[0];
    },
    getTraceString: function getTraceString(queryable) {
        var compiled = this._compile(queryable);
        return compiled;
    },
    supportedDataTypes: {
        value: [_core2.default.Integer, _core2.default.String, _core2.default.Number, _core2.default.Blob, _core2.default.Boolean, _core2.default.Date, _core2.default.Object, _core2.default.Guid, _core2.default.GeographyPoint, _core2.default.GeographyLineString, _core2.default.GeographyPolygon, _core2.default.GeographyMultiPoint, _core2.default.GeographyMultiLineString, _core2.default.GeographyMultiPolygon, _core2.default.GeographyCollection, _core2.default.GeometryPoint, _core2.default.GeometryLineString, _core2.default.GeometryPolygon, _core2.default.GeometryMultiPoint, _core2.default.GeometryMultiLineString, _core2.default.GeometryMultiPolygon, _core2.default.GeometryCollection, _core2.default.Byte, _core2.default.SByte, _core2.default.Decimal, _core2.default.Float, _core2.default.Int16, _core2.default.Int32, _core2.default.Int64, _core2.default.Time, _core2.default.DateTimeOffset],
        writable: false
    },

    supportedBinaryOperators: {
        value: {
            equal: { mapTo: ' == ', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression] },
            notEqual: { mapTo: ' != ', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression] },
            equalTyped: { mapTo: ' === ', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression] },
            notEqualTyped: { mapTo: ' !== ', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression] },
            greaterThan: { mapTo: ' > ', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression] },
            greaterThanOrEqual: { mapTo: ' >= ', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression] },

            lessThan: { mapTo: ' < ', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression] },
            lessThenOrEqual: { mapTo: ' <= ', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression] },
            or: { mapTo: ' || ', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression] },
            and: { mapTo: ' && ', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression] },

            "in": { mapTo: ".indexOf(", allowedIn: [_core2.default.Expressions.FilterExpression], rightValue: ') > -1', reverse: true }
        }
    },

    supportedUnaryOperators: {
        value: {
            not: { mapTo: '!' }
        }
    },

    supportedFieldOperations: {
        value: {
            contains: {
                mapTo: "$data.StringFunctions.contains(",
                rightValue: ")",
                dataType: "boolean",
                parameters: [{ name: "@expression", dataType: "string" }, { name: "strFragment", dataType: "string" }]
            },

            startsWith: {
                mapTo: "$data.StringFunctions.startsWith(",
                rightValue: ")",
                dataType: "boolean",
                parameters: [{ name: "@expression", dataType: "string" }, { name: "strFragment", dataType: "string" }]
            },

            endsWith: {
                mapTo: "$data.StringFunctions.endsWith(",
                rightValue: ")",
                dataType: "boolean",
                parameters: [{ name: "@expression", dataType: "string" }, { name: "strFragment", dataType: "string" }]
            },
            length: {
                dataType: "number",
                propertyFunction: true
            },
            substr: {
                mapTo: "substr(",
                rightValue: ")",
                dataType: "string",
                parameters: [{ name: "startFrom", dataType: "number" }, { name: "length", dataType: "number" }],
                propertyFunction: true
            },
            toLowerCase: {
                dataType: "string", mapTo: "toLowerCase()",
                propertyFunction: true
            },
            toUpperCase: {
                dataType: "string", mapTo: "toUpperCase()",
                propertyFunction: true
            },
            'trim': {
                dataType: _core2.default.String,
                mapTo: 'trim()',
                propertyFunction: true
            },
            'ltrim': {
                dataType: _core2.default.String,
                mapTo: 'trimLeft()',
                propertyFunction: true
            },
            'rtrim': {
                dataType: _core2.default.String,
                mapTo: 'trimRight()',
                propertyFunction: true
            }
        },
        enumerable: true,
        writable: true
    },

    supportedSetOperations: {
        value: {
            filter: {},
            map: {},
            length: {},
            forEach: {},
            toArray: {},
            single: {},
            some: {},
            //every: {},
            take: {},
            skip: {},
            orderBy: {},
            orderByDescending: {},
            first: {}
        },
        enumerable: true,
        writable: true
    },
    fieldConverter: { value: _core2.default.InMemoryConverter },
    supportedAutoincrementKeys: {
        value: {
            '$data.Integer': true,
            '$data.Int32': true,
            '$data.Guid': function $dataGuid() {
                return _core2.default.createGuid();
            }
        }
    }
}, null);
(0, _core.$C)('$data.storageProviders.InMemory.LocalStorageProvider', _core2.default.storageProviders.InMemory.InMemoryProvider, null, {
    constructor: function constructor(cfg, ctx) {
        this.providerConfiguration.persistentData = true;
    }
}, null);
_core2.default.StorageProviderBase.registerProvider("InMemory", _core2.default.storageProviders.InMemory.InMemoryProvider);
_core2.default.StorageProviderBase.registerProvider("LocalStore", _core2.default.storageProviders.InMemory.LocalStorageProvider);