'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {

    _index2.default.defaults = _index2.default.defaults || {};
    _index2.default.defaults.defaultDatabaseName = 'JayDataDefault';
    _index2.default.defaults.enableRelatedEntityReadMethods = true;
    _index2.default.defaults.relatedEntityReadMethodPrefix = 'get';
    _index2.default.defaults.relatedEntityProxyPrefix = '$relatedProxy';
})();

_index2.default.Class.define('$data.StorageModel', null, null, {
    constructor: function constructor() {
        ///<field name="LogicalType" type="$data.Entity">User defined type</field>
        this.ComplexTypes = [];
        this.Enums = [];
        this.Associations = [];
        this.IsComplexType = false;
    },
    LogicalType: {},
    LogicalTypeName: {},
    PhysicalType: {},
    PhysicalTypeName: {},
    EventHandlers: {},
    TableName: {},
    TableOptions: { value: undefined },
    ComplexTypes: {},
    Enums: {},
    Associations: {},
    ContextType: {},
    Roles: {},
    IsComplexType: {}
}, null);
_index2.default.Class.define('$data.Association', null, null, {
    constructor: function constructor(initParam) {
        if (initParam) {
            this.From = initParam.From;
            this.FromType = initParam.FromType;
            this.FromMultiplicity = initParam.FromMultiplicity;
            this.FromPropertyName = initParam.FromPropertyName;
            this.To = initParam.To;
            this.ToType = initParam.ToType;
            this.ToMultiplicity = initParam.ToMultiplicity;
            this.ToPropertyName = initParam.ToPropertyName;
            this.ReferentialConstraint = [].concat(initParam.ReferentialConstraint || []);
        }
    },
    From: {},
    FromType: {},
    FromMultiplicity: {},
    FromPropertyName: {},
    To: {},
    ToType: {},
    ToMultiplicity: {},
    ToPropertyName: {},
    ReferentialConstraint: {}
}, null);
_index2.default.Class.define('$data.ComplexType', _index2.default.Association, null, {}, null);

/**
 * @public
 * @module $data.EntityContext
 */
/**
* Provides facilities for querying and working with entity data as objects
*/
_index2.default.Class.define('$data.EntityContext', null, null, {
    /**
     * @constructs $data.EntityContext
     * Provides facilities for querying and working with entity data as objects
     * @param {Object} storageProviderCfg - Storage provider specific configuration object
     * @param {string} storageProviderCfg.provider - Storage provider type name: 'oData', 'indexedDb', 'webSql', 'sqLite', 'mongoDB'
     * @param {string} [storageProviderCfg.oDataServiceHost=/odata.svc] - URI of OData endpoint. Provider: OData
     * @param {string} [storageProviderCfg.maxDataServiceVersion=4.0] - Maximal OData version. Provider: OData
     * @param {string} [storageProviderCfg.dataServiceVersion] - version of your OData endpoint. Provider: OData
     * @param {string} [storageProviderCfg.user] - login name for basic auth. Provider: OData
     * @param {string} [storageProviderCfg.password] - password for basic auth. Provider: OData
     * @param {string} [storageProviderCfg.UpdateMethod=PATCH] - HTTP verb used while updating entities, this should be configured according the accepted verb by your OData endpoint. Provider: OData
     * @param {string} [storageProviderCfg.databaseName] - database name created by the following providers: webSql, sqLite, indexedDb, mongoDB
     * @example <caption>initialize OData context</caption>
     * var northwind = new Northwind({
     *  provider: 'oData',
     *  oDataServiceHost: '/api/odata.svc'
     * });
     * northwind.onReady(function() {
     *  //work with your context
     * });
     *
     * @example <caption>initialize webSql context</caption>
     * var northwind = new Northwind({
     *  provider: 'webSql',
     *  databaseName: 'Northwind'
     * });
     * northwind.onReady(function() {
     *  //work with your context
     * });
     */
    constructor: function constructor(storageProviderCfg) {
        if (_index2.default.ItemStore && 'ContextRegister' in _index2.default.ItemStore) _index2.default.ItemStore.ContextRegister.apply(this, arguments);

        if (storageProviderCfg.queryCache) this.queryCache = storageProviderCfg.queryCache;

        if ("string" === typeof storageProviderCfg) {
            if (0 === storageProviderCfg.indexOf("http")) {
                storageProviderCfg = {
                    name: "oData",
                    oDataServiceHost: storageProviderCfg
                };
            } else {
                storageProviderCfg = {
                    name: "local",
                    databaseName: storageProviderCfg
                };
            }
        }

        if ("provider" in storageProviderCfg) {
            storageProviderCfg.name = storageProviderCfg.provider;
        }

        //Initialize properties
        this.lazyLoad = false;
        this.trackChanges = false;
        this._entitySetReferences = {};
        this._storageModel = [];

        var ctx = this;
        ctx._isOK = false;

        var origSuccessInitProvider = this._successInitProvider;
        this._successInitProvider = function (errorOrContext) {
            if (errorOrContext instanceof _index2.default.EntityContext) {
                origSuccessInitProvider(ctx);
            } else {
                origSuccessInitProvider(ctx, errorOrContext);
            }
        };

        this._storageModel.getStorageModel = function (typeName) {
            var name = _index.Container.resolveName(typeName);
            return ctx._storageModel[name];
        };
        if (typeof storageProviderCfg.name === 'string') {
            var tmp = storageProviderCfg.name;
            storageProviderCfg.name = [tmp];
        }
        var i = 0,
            providerType;
        var providerList = [].concat(storageProviderCfg.name);
        var callBack = _index2.default.PromiseHandlerBase.createCallbackSettings({ success: this._successInitProvider, error: this._successInitProvider });

        this._initStorageModelSync();
        this._initStorageModelNavigationProperties();
        ctx._initializeEntitySets(ctx.getType());

        _index2.default.StorageProviderLoader.load(providerList, {
            success: function success(providerType) {
                ctx.storageProvider = new providerType(storageProviderCfg, ctx);
                ctx.storageProvider.setContext(ctx);
                ctx.stateManager = new _index2.default.EntityStateManager(ctx);

                var contextType = ctx.getType();
                if (providerType.name in contextType._storageModelCache) {
                    ctx._storageModel = contextType._storageModelCache[providerType.name];
                } else {
                    _index2.default.defaults.enableRelatedEntityReadMethods && ctx._applyRelatedEntityMethodsToTypes();
                    ctx._initializeStorageModel();
                    contextType._storageModelCache[providerType.name] = ctx._storageModel;
                }
                _index2.default.defaults.enableRelatedEntityReadMethods && ctx._applyRelatedEntityMethodsToContext();

                //ctx._initializeEntitySets(contextType);
                if (storageProviderCfg && storageProviderCfg.user) Object.defineProperty(ctx, 'user', { value: storageProviderCfg.user, enumerable: true });
                if (storageProviderCfg && storageProviderCfg.checkPermission) Object.defineProperty(ctx, 'checkPermission', { value: storageProviderCfg.checkPermission, enumerable: true });

                //ctx._isOK = false;
                ctx._initializeStore(callBack);
            },
            error: function error() {
                callBack.error('Provider fallback failed!');
            }
        });

        this.addEventListener = function (eventName, fn) {
            var delegateName = "on" + eventName;
            if (!(delegateName in this)) {
                this[delegateName] = new _index2.default.Event(eventName, this);
            }
            this[delegateName].attach(fn);
        };

        this.removeEventListener = function (eventName, fn) {
            var delegateName = "on" + eventName;
            if (!(delegateName in this)) {
                return;
            }
            this[delegateName].detach(fn);
        };

        this.raiseEvent = function (eventName, data) {
            var delegateName = "on" + eventName;
            if (!(delegateName in this)) {
                return;
            }
            this[delegateName].fire(data);
        };

        this.ready = this.onReady({
            success: _index2.default.defaultSuccessCallback,
            error: function error() {
                if (_index2.default.PromiseHandler !== _index2.default.PromiseHandlerBase) {
                    _index2.default.defaultErrorCallback.apply(this, arguments);
                } else {
                    _index2.default.Trace.error(arguments);
                }
            }
        });
    },
    beginTransaction: function beginTransaction() {
        var tables = null;
        var callBack = null;
        var isWrite = false;

        function readParam(value) {
            if (_index.Guard.isNullOrUndefined(value)) return;

            if (typeof value === 'boolean') {
                isWrite = value;
            } else if (Array.isArray(value)) {
                tables = value;
            } else {
                callBack = value;
            }
        }

        readParam(arguments[0]);
        readParam(arguments[1]);
        readParam(arguments[2]);

        var pHandler = new _index2.default.PromiseHandler();
        callBack = pHandler.createCallback(callBack);

        //callBack = $data.PromiseHandlerBase.createCallbackSettings(callBack);
        this.storageProvider._beginTran(tables, isWrite, callBack);

        return pHandler.getPromise();
    },
    _isReturnTransaction: function _isReturnTransaction(transaction) {
        return transaction instanceof _index2.default.Base || transaction === 'returnTransaction';
    },
    _applyTransaction: function _applyTransaction(scope, cb, args, transaction, isReturnTransaction) {
        if (isReturnTransaction === true) {
            if (transaction instanceof _index2.default.Transaction) {
                Array.prototype.push.call(args, transaction);
                cb.apply(scope, args);
            } else {
                this.beginTransaction(function (tran) {
                    Array.prototype.push.call(args, tran);
                    cb.apply(scope, args);
                });
            }
        } else {
            cb.apply(scope, args);
        }
    },

    getDataType: function getDataType(dataType) {
        // Obsolate
        if (typeof dataType == "string") {
            var memDef_dataType = this[dataType];
            if (memDef_dataType === undefined || memDef_dataType === null) {
                memDef_dataType = eval(dataType);
            }
            return memDef_dataType;
        }
        return dataType;
    },
    _initializeEntitySets: function _initializeEntitySets(ctor) {

        for (var i = 0, l = this._storageModel.length; i < l; i++) {
            var storageModel = this._storageModel[i];
            if (storageModel.BaseType) continue;
            this[storageModel.ItemName] = new _index2.default.EntitySet(storageModel.LogicalType, this, storageModel.ItemName, storageModel.EventHandlers, storageModel.Roles);
            var sm = this[storageModel.ItemName];
            sm.name = storageModel.ItemName;
            sm.tableName = storageModel.TableName;
            sm.tableOptions = storageModel.TableOptions;
            sm.eventHandlers = storageModel.EventHandlers;
            this._entitySetReferences[storageModel.LogicalType.name] = sm;

            this._initializeActions(sm, ctor, ctor.getMemberDefinition(storageModel.ItemName));
        }
    },
    _initializeStore: function _initializeStore(callBack) {
        if (this.storageProvider) {
            this.storageProvider.initializeStore(callBack);
        }
    },
    _createNavPropStorageModel: function _createNavPropStorageModel(logicalType) {
        var ctx = this;
        logicalType.memberDefinitions.getPublicMappedProperties()
        // .filter(function(it){ return it.inverseProperty; })
        .forEach(function (memDef) {
            var item = _index.Container.resolveType(memDef.elementType || memDef.dataType);
            if (item.isAssignableTo && item.isAssignableTo(_index2.default.Entity) && !ctx._storageModel.filter(function (it) {
                return it.LogicalType == item;
            })[0]) {
                var storageModel = new _index2.default.StorageModel();
                storageModel.TableName = memDef.name;
                storageModel.TableOptions = item.tableOptions;
                storageModel.ItemName = item.name;
                storageModel.LogicalType = item;
                storageModel.LogicalTypeName = item.name;
                storageModel.PhysicalTypeName = _index2.default.EntityContext._convertLogicalTypeNameToPhysical(storageModel.LogicalTypeName);
                storageModel.ContextType = ctx.getType();
                storageModel.IsComplexType = !item.memberDefinitions.getPublicMappedProperties().filter(function (p) {
                    return p.key;
                }).length;

                ctx._storageModel.push(storageModel);

                var name = _index.Container.resolveName(item);
                ctx._storageModel[name] = storageModel;

                ctx._createNavPropStorageModel(storageModel.LogicalType);
            }
        });
    },
    _initStorageModelNavigationProperties: function _initStorageModelNavigationProperties() {
        for (var i = 0; i < this._storageModel.length; i++) {
            var storageModel = this._storageModel[i];
            this._createNavPropStorageModel(storageModel.LogicalType);
        }
    },
    _initStorageModelSync: function _initStorageModelSync() {
        var _memDefArray = this.getType().memberDefinitions.asArray();

        for (var i = 0; i < _memDefArray.length; i++) {
            var item = _memDefArray[i];
            if ('dataType' in item) {
                var itemResolvedDataType = _index.Container.resolveType(item.dataType);
                if (itemResolvedDataType && itemResolvedDataType.isAssignableTo && itemResolvedDataType.isAssignableTo(_index2.default.EntitySet)) {
                    var elementType = _index.Container.resolveType(item.elementType);
                    var storageModel = new _index2.default.StorageModel();
                    storageModel.TableName = item.tableName || item.name;
                    storageModel.TableOptions = item.tableOptions;
                    storageModel.ItemName = item.name;
                    storageModel.LogicalType = elementType;
                    storageModel.LogicalTypeName = elementType.name;
                    storageModel.PhysicalTypeName = _index2.default.EntityContext._convertLogicalTypeNameToPhysical(storageModel.LogicalTypeName);
                    storageModel.ContextType = this.getType();
                    storageModel.Roles = item.roles;
                    if (item.indices) {
                        storageModel.indices = item.indices;
                    }
                    if (item.beforeCreate) {
                        if (!storageModel.EventHandlers) storageModel.EventHandlers = {};
                        storageModel.EventHandlers.beforeCreate = item.beforeCreate;
                    }
                    if (item.beforeRead) {
                        if (!storageModel.EventHandlers) storageModel.EventHandlers = {};
                        storageModel.EventHandlers.beforeRead = item.beforeRead;
                    }
                    if (item.beforeUpdate) {
                        if (!storageModel.EventHandlers) storageModel.EventHandlers = {};
                        storageModel.EventHandlers.beforeUpdate = item.beforeUpdate;
                    }
                    if (item.beforeDelete) {
                        if (!storageModel.EventHandlers) storageModel.EventHandlers = {};
                        storageModel.EventHandlers.beforeDelete = item.beforeDelete;
                    }
                    if (item.afterCreate) {
                        if (!storageModel.EventHandlers) storageModel.EventHandlers = {};
                        storageModel.EventHandlers.afterCreate = item.afterCreate;
                    }
                    if (item.afterRead) {
                        if (!storageModel.EventHandlers) storageModel.EventHandlers = {};
                        storageModel.EventHandlers.afterRead = item.afterRead;
                    }
                    if (item.afterUpdate) {
                        if (!storageModel.EventHandlers) storageModel.EventHandlers = {};
                        storageModel.EventHandlers.afterUpdate = item.afterUpdate;
                    }
                    if (item.afterDelete) {
                        if (!storageModel.EventHandlers) storageModel.EventHandlers = {};
                        storageModel.EventHandlers.afterDelete = item.afterDelete;
                    }
                    this._storageModel.push(storageModel);
                    var name = _index.Container.resolveName(elementType);
                    this._storageModel[name] = storageModel;

                    if (elementType.inheritedTo) {
                        var ctx = this;
                        elementType.inheritedTo.forEach(function (type) {
                            var storageModel = new _index2.default.StorageModel();
                            storageModel.TableName = item.tableName || item.name;
                            storageModel.TableOptions = item.tableOptions;
                            storageModel.ItemName = item.name;
                            storageModel.LogicalType = type;
                            storageModel.LogicalTypeName = type.name;
                            storageModel.PhysicalTypeName = _index2.default.EntityContext._convertLogicalTypeNameToPhysical(storageModel.LogicalTypeName);
                            storageModel.ContextType = ctx.getType();
                            storageModel.BaseType = elementType;

                            ctx._storageModel.push(storageModel);
                            var name = _index.Container.resolveName(type);
                            ctx._storageModel[name] = storageModel;
                        });
                    }
                }
            }
        }
    },
    _inheritanceMemberDefinitions: function _inheritanceMemberDefinitions(type, memdefs) {
        var self = this;
        if (type.inheritedTo) {
            type.inheritedTo.forEach(function (it) {
                memdefs = self._inheritanceMemberDefinitions(it, memdefs.concat(it.memberDefinitions.getPublicMappedProperties()));
            });
        }
        return memdefs;
    },
    _buildDbInstanceDefinition: function _buildDbInstanceDefinition(storageModel, dbEntityInstanceDefinition) {
        storageModel.Associations = storageModel.Associations || [];
        storageModel.ComplexTypes = storageModel.ComplexTypes || [];
        storageModel.Enums = storageModel.Enums || [];
        var memberDefinitions = this._inheritanceMemberDefinitions(storageModel.LogicalType, storageModel.LogicalType.memberDefinitions.getPublicMappedProperties());
        for (var j = 0; j < memberDefinitions.length; j++) {
            var memDef = memberDefinitions[j];
            ///<param name="memDef" type="MemberDefinition">Member definition instance</param>

            var memDefResolvedDataType = _index.Container.resolveType(memDef.dataType);

            if ((this.storageProvider.supportedDataTypes.indexOf(memDefResolvedDataType) > -1 || memDefResolvedDataType.isAssignableTo && memDefResolvedDataType.isAssignableTo(_index2.default.Enum)) && _index.Guard.isNullOrUndefined(memDef.inverseProperty)) {
                //copy member definition
                var t = JSON.parse(JSON.stringify(memDef));
                //change datatype to resolved type
                t.dataType = memDefResolvedDataType;
                dbEntityInstanceDefinition[memDef.name] = t;

                if (memDefResolvedDataType.isAssignableTo && memDefResolvedDataType.isAssignableTo(_index2.default.Enum)) {
                    this._build_EnumDefinition(dbEntityInstanceDefinition, storageModel, memDefResolvedDataType, memDef);
                }

                continue;
            }

            this._buildDbType_navigationPropertyComplite(memDef, memDefResolvedDataType, storageModel);

            if ((memDefResolvedDataType === _index2.default.Array || memDefResolvedDataType.isAssignableTo && memDefResolvedDataType.isAssignableTo(_index2.default.EntitySet)) && memDef.inverseProperty && memDef.inverseProperty !== '$$unbound') {
                this._buildDbType_Collection_OneManyDefinition(dbEntityInstanceDefinition, storageModel, memDefResolvedDataType, memDef);
            } else {
                if (memDef.inverseProperty) {
                    if (memDef.inverseProperty === '$$unbound') {
                        //member definition is navigation but not back reference
                        if (memDefResolvedDataType === _index2.default.Array) {
                            this._buildDbType_Collection_OneManyDefinition(dbEntityInstanceDefinition, storageModel, memDefResolvedDataType, memDef);
                        } else {
                            this._buildDbType_ElementType_OneManyDefinition(dbEntityInstanceDefinition, storageModel, memDefResolvedDataType, memDef);
                        }
                    } else {
                        //member definition is navigation property one..one or one..many case
                        var fields = memDefResolvedDataType.memberDefinitions.getMember(memDef.inverseProperty);
                        if (fields) {
                            if (fields.elementType) {
                                //member definition is one..many connection
                                var referealResolvedType = _index.Container.resolveType(fields.elementType);
                                this._buildDbType_ElementType_OneManyDefinition(dbEntityInstanceDefinition, storageModel, memDefResolvedDataType, memDef);
                            } else {
                                //member definition is one..one connection
                                this._buildDbType_ElementType_OneOneDefinition(dbEntityInstanceDefinition, storageModel, memDefResolvedDataType, memDef);
                            }
                        } else {
                            if (typeof intellisense === 'undefined') {
                                _index.Guard.raise(new _index.Exception('Inverse property not valid'));
                            }
                        }
                    }
                } else {
                    //member definition is a complex type
                    this._buildDbType_addComplexTypePropertyDefinition(dbEntityInstanceDefinition, storageModel, memDefResolvedDataType, memDef);
                }
            }
        }
    },
    _initializeStorageModel: function _initializeStorageModel() {

        var _memDefArray = this.getType().memberDefinitions.asArray();

        if (typeof intellisense !== 'undefined') return;

        for (var i = 0; i < this._storageModel.length; i++) {
            var storageModel = this._storageModel[i];

            ///<param name="storageModel" type="$data.StorageModel">Storage model item</param>
            var dbEntityInstanceDefinition = {};
            this._buildDbInstanceDefinition(storageModel, dbEntityInstanceDefinition);

            this._buildDbType_modifyInstanceDefinition(dbEntityInstanceDefinition, storageModel, this);
            var dbEntityClassDefinition = {};
            dbEntityClassDefinition.convertTo = this._buildDbType_generateConvertToFunction(storageModel, this);
            this._buildDbType_modifyClassDefinition(dbEntityClassDefinition, storageModel, this);

            //create physical type
            //TODO
            storageModel.PhysicalType = _index2.default.Class.define(storageModel.PhysicalTypeName, _index2.default.Entity, storageModel.LogicalType.container, dbEntityInstanceDefinition, dbEntityClassDefinition);
        }
    },
    _initializeActions: function _initializeActions(es, ctor, esDef) {
        if (esDef && esDef.actions) {
            var actionKeys = Object.keys(esDef.actions);
            for (var i = 0; i < actionKeys.length; i++) {
                var actionName = actionKeys[i];
                var action = esDef.actions[actionName];
                if (typeof action === 'function') {
                    es[actionName] = action;
                } else {
                    var actionDef = _index2.default.MemberDefinition.translateDefinition(action, actionName, ctor);
                    if (actionDef instanceof _index2.default.MemberDefinition && actionDef.kind === _index2.default.MemberTypes.method) {
                        es[actionName] = actionDef.method;
                    }
                }
            }
        }
    },
    _buildDbType_navigationPropertyComplite: function _buildDbType_navigationPropertyComplite(memDef, memDefResolvedDataType, storageModel) {
        if (!memDef.inverseProperty) {
            var refMemDefs = null;
            if (memDefResolvedDataType === _index2.default.Array || memDefResolvedDataType.isAssignableTo && memDefResolvedDataType.isAssignableTo(_index2.default.EntitySet)) {
                var refStorageModel = this._storageModel.getStorageModel(_index.Container.resolveType(memDef.elementType));
                if (refStorageModel) {
                    refMemDefs = [];
                    var pubDefs = refStorageModel.LogicalType.memberDefinitions.getPublicMappedProperties();
                    for (var i = 0; i < pubDefs.length; i++) {
                        var m = pubDefs[i];
                        if (m.inverseProperty == memDef.name && _index.Container.resolveType(m.dataType) === _index.Container.resolveType(storageModel.LogicalType)) refMemDefs.push(m);
                    }
                }
            } else {
                var refStorageModel = this._storageModel.getStorageModel(memDefResolvedDataType);
                if (refStorageModel) {
                    refMemDefs = [];
                    var pubDefs = refStorageModel.LogicalType.memberDefinitions.getPublicMappedProperties();
                    for (var i = 0; i < pubDefs.length; i++) {
                        var m = pubDefs[i];
                        if (m.elementType && m.inverseProperty == memDef.name && _index.Container.resolveType(m.elementType) === storageModel.LogicalType) refMemDefs.push(m);else if (m.inverseProperty == memDef.name && _index.Container.resolveType(m.dataType) === storageModel.LogicalType) refMemDefs.push(m);
                    }
                }
            }
            if (refMemDefs) {
                if (refMemDefs.length > 1) {
                    if (typeof intellisense !== 'undefined') {
                        _index.Guard.raise(new _index.Exception('More than one inverse property refer to this member definition: ' + memDef.name + ', type: ' + _index.Container.resolveName(storageModel.LogicalType)));
                    }
                }
                var refMemDef = refMemDefs.pop();
                if (refMemDef) {
                    memDef.inverseProperty = refMemDef.name;
                }
            }
        } else {
            var refStorageModel = null;
            if (memDefResolvedDataType === _index2.default.Array || memDefResolvedDataType.isAssignableTo && memDefResolvedDataType.isAssignableTo(_index2.default.EntitySet)) {
                refStorageModel = this._storageModel.getStorageModel(_index.Container.resolveType(memDef.elementType));
            } else {
                refStorageModel = this._storageModel.getStorageModel(memDefResolvedDataType);
            }

            var p = refStorageModel.LogicalType.memberDefinitions.getMember(memDef.inverseProperty);
            if (p) {
                if (p.inverseProperty) {
                    if (p.inverseProperty != memDef.name) {
                        if (typeof intellisense === 'undefined') {
                            _index.Guard.raise(new _index.Exception('Inverse property mismatch'));
                        }
                    }
                } else {
                    p.inverseProperty = memDef.name;
                }
            }
        }
    },
    _buildDbType_generateConvertToFunction: function _buildDbType_generateConvertToFunction(storageModel) {
        return function (instance) {
            return instance;
        };
    },
    _buildDbType_modifyInstanceDefinition: function _buildDbType_modifyInstanceDefinition(instanceDefinition, storageModel) {
        return;
    },
    _buildDbType_modifyClassDefinition: function _buildDbType_modifyClassDefinition(classDefinition, storageModel) {
        return;
    },
    _buildDbType_addComplexTypePropertyDefinition: function _buildDbType_addComplexTypePropertyDefinition(dbEntityInstanceDefinition, storageModel, memDef_dataType, memDef) {
        this._addNavigationPropertyDefinition(dbEntityInstanceDefinition, memDef, memDef.name, _index2.default.MemberTypes.complexProperty);
        var complexType = this._createComplexElement(storageModel.LogicalType, "", memDef.name, memDef_dataType, "", "");
        storageModel.ComplexTypes[memDef.name] = complexType;
        storageModel.ComplexTypes.push(complexType);
    },
    _buildDbType_Collection_OneManyDefinition: function _buildDbType_Collection_OneManyDefinition(dbEntityInstanceDefinition, storageModel, memDef_dataType, memDef) {
        var refereedType = _index.Container.resolveType(memDef.elementType);
        if (refereedType === undefined || refereedType === null) {
            if (typeof intellisense === 'undefined') {
                _index.Guard.raise(new _index.Exception("Element type definition error", "Field definition", memDef));
            }
        }
        var refereedStorageModel = this._storageModel.getStorageModel(refereedType);
        //var refereedStorageModel = this._storageModel.filter(function (s) { return s.LogicalType === refereedType; })[0];
        if (!refereedStorageModel) {
            if (typeof intellisense === 'undefined') {
                _index.Guard.raise(new _index.Exception("No EntitySet definition for the following element type", "Field definition", memDef));
            }
        }

        this._addNavigationPropertyDefinition(dbEntityInstanceDefinition, memDef, memDef.name);
        var associationType = memDef.inverseProperty === '$$unbound' ? '$$unbound' : '0..1';
        var association = this._addAssociationElement(memDef.definedBy, associationType, memDef.name, refereedStorageModel.LogicalType, "*", memDef.inverseProperty);
        storageModel.Associations[memDef.name] = association;
        storageModel.Associations.push(association);
    },
    _buildDbType_ElementType_OneManyDefinition: function _buildDbType_ElementType_OneManyDefinition(dbEntityInstanceDefinition, storageModel, memDef_dataType, memDef) {
        var refereedType = _index.Container.resolveType(memDef.dataType);
        if (refereedType === undefined || refereedType === null) {
            if (typeof intellisense === 'undefined') {
                _index.Guard.raise(new _index.Exception("Element type definition error", "Field definition", memDef));
            }
        }
        var refereedStorageModel = this._storageModel.getStorageModel(refereedType);
        //var refereedStorageModel = this._storageModel.filter(function (s) { return s.LogicalType === refereedType; })[0];
        if (!refereedStorageModel) {
            if (typeof intellisense === 'undefined') {
                _index.Guard.raise(new _index.Exception("No EntitySet definition for the following element type", "Field definition", memDef));
            }
        }

        this._addNavigationPropertyDefinition(dbEntityInstanceDefinition, memDef, memDef.name);
        var associationType = memDef.inverseProperty === '$$unbound' ? '$$unbound' : '*';
        var association = this._addAssociationElement(memDef.definedBy, associationType, memDef.name, refereedType, "0..1", memDef.inverseProperty);
        storageModel.Associations[memDef.name] = association;
        storageModel.Associations.push(association);
    },
    _buildDbType_ElementType_OneOneDefinition: function _buildDbType_ElementType_OneOneDefinition(dbEntityInstanceDefinition, storageModel, memDef_dataType, memDef) {
        var refereedType = _index.Container.resolveType(memDef.dataType);
        if (refereedType === undefined || refereedType === null) {
            if (typeof intellisense === 'undefined') {
                _index.Guard.raise(new _index.Exception("Element type definition error", "Field definition", memDef));
            }
        }
        var refereedStorageModel = this._storageModel.getStorageModel(refereedType);;
        //var refereedStorageModel = this._storageModel.filter(function (s) { return s.LogicalType === refereedType; })[0];
        if (!refereedStorageModel) {
            if (typeof intellisense === 'undefined') {
                _index.Guard.raise(new _index.Exception("No EntitySet definition following element type", "Field definition", memDef));
            }
        }

        var refereedMemberDefinition = refereedStorageModel.LogicalType.memberDefinitions.getMember(memDef.inverseProperty);
        if (!refereedMemberDefinition.required && !memDef.required) {
            if (typeof intellisense === 'undefined') {
                if (typeof intellisense === 'undefined') {
                    _index.Guard.raise(new _index.Exception('In one to one connection, one side must required!', 'One to One connection', memDef));
                }
            }
        }

        this._addNavigationPropertyDefinition(dbEntityInstanceDefinition, memDef, memDef.name);

        var association = this._addAssociationElement(memDef.definedBy, memDef.required ? "0..1" : "1", memDef.name, refereedStorageModel.LogicalType, memDef.required ? "1" : "0..1", memDef.inverseProperty);
        storageModel.Associations[memDef.name] = association;
        storageModel.Associations.push(association);
    },
    _addNavigationPropertyDefinition: function _addNavigationPropertyDefinition(definition, member, associationName, kind) {
        var t = JSON.parse(JSON.stringify(member));
        t.dataType = _index2.default.EntitySet;
        t.notMapped = true;
        t.kind = kind ? kind : _index2.default.MemberTypes.navProperty;
        t.association = associationName;
        definition[member.name] = t;
    },
    _addAssociationElement: function _addAssociationElement(fromType, fromMultiplicity, fromPropName, toType, toMultiplicity, toPropName) {
        return new _index2.default.Association({
            From: fromType.name,
            FromType: fromType,
            FromMultiplicity: fromMultiplicity,
            FromPropertyName: fromPropName,
            To: toType.name,
            ToType: toType,
            ToMultiplicity: toMultiplicity,
            ReferentialConstraint: [],
            ToPropertyName: toPropName
        });
    },
    _createComplexElement: function _createComplexElement(fromType, fromMultiplicity, fromPropName, toType, toMultiplicity, toPropName) {
        return new _index2.default.ComplexType({
            From: fromType.name,
            FromType: fromType,
            FromMultiplicity: fromMultiplicity,
            FromPropertyName: fromPropName,
            To: toType.name,
            ToType: toType,
            ToMultiplicity: toMultiplicity,
            ReferentialConstraint: [],
            ToPropertyName: toPropName
        });
    },
    _build_EnumDefinition: function _build_EnumDefinition(dbEntityInstanceDefinition, storageModel, memDefResolvedDataType, memDef) {
        storageModel.Enums.push(memDefResolvedDataType);

        var typeName = _index.Container.resolveName(memDefResolvedDataType);
        var converterGroups = this.storageProvider.fieldConverter;

        var createEnumConverter = function createEnumConverter(converterGroup) {
            converterGroup[typeName] = function (value) {
                return converterGroup["$data.Enum"].call(this, value, memDefResolvedDataType);
            };
        };

        for (var i in converterGroups) {
            if (!converterGroups[i][typeName] && converterGroups[i]["$data.Enum"]) {
                createEnumConverter(converterGroups[i]);
                if (_index2.default.SqLiteFieldMapping) _index2.default.SqLiteFieldMapping[typeName] = 'INTEGER';
            }
        }
    },

    _successInitProvider: function _successInitProvider(context, error) {
        if (context instanceof _index2.default.EntityContext && context._isOK !== undefined) {
            if (!error) {
                context._isOK = true;
                if (context.onReadyFunction) {
                    for (var i = 0; i < context.onReadyFunction.length; i++) {
                        context.onReadyFunction[i].success(context);
                    }
                    context.onReadyFunction = undefined;
                }
            } else {
                context._isOK = error;
                if (context.onReadyFunction) {
                    for (var i = 0; i < context.onReadyFunction.length; i++) {
                        context.onReadyFunction[i].error(error);
                    }
                    context.onReadyFunction = undefined;
                }
            }
        }
    },
    /**
     * Sets the callback function to be called when the initialization of the {@link $data.EntityContext} has successfully finished.
     * @event $data.EntityContext#onReady
     * @param {function|function[]} fn - Success callback
     * @returns {$.Deferred}
     */
    onReady: function onReady(fn) {
        /// <signature>
        ///     <summary>
        ///
        ///     </summary>
        ///     <param name="successCallback" type="Function">
        ///         <summary>Success callback</summary>
        ///         <param name="entityContext" type="$data.EntityContext">Current entityContext object</param>
        ///     </param>
        ///     <returns type="" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Sets the callback functions to be called when the initialization of the EntityContext has finished.
        ///     </summary>
        ///     <param name="callbacks" type="Object">
        ///         Success and error callbacks definition.
        ///         Example: [code]{ success: function(db) { .. }, error: function() { .. } }[/code]
        ///     </param>
        ///     <returns type="$.Deferred" />
        /// </signature>
        var pHandler = new _index2.default.PromiseHandler();
        var callBack = pHandler.createCallback(fn);
        if (this._isOK === true) {
            callBack.success(this);
        } else if (this._isOK !== false) {
            callBack.error(this._isOK);
        } else {
            this.onReadyFunction = this.onReadyFunction || [];
            this.onReadyFunction.push(callBack);
        }

        return pHandler.getPromise();
    },
    ready: { type: _index2.default.Promise },
    getEntitySetFromElementType: function getEntitySetFromElementType(elementType) {
        /// <signature>
        ///     <summary>Gets the matching EntitySet for an element type.</summary>
        ///     <param name="elementType" type="Function" />
        ///     <returns type="$data.EntitySet" />
        /// </signature>
        /// <signature>
        ///     <summary>Gets the matching EntitySet for an element type.</summary>
        ///     <param name="elementType" type="String" />
        ///     <returns type="$data.EntitySet" />
        /// </signature>
        var result = this._entitySetReferences[elementType];
        if (!result) {
            try {
                result = this._entitySetReferences[eval(elementType).name];
            } catch (ex) {}
        }
        if (!result && elementType.isAssignableTo && elementType.isAssignableTo(_index2.default.Entity)) {
            if (!this._storageModel[elementType.name]) {
                var storageModel = new _index2.default.StorageModel();
                storageModel.TableName = elementType.name;
                storageModel.ItemName = elementType.name;
                storageModel.LogicalType = elementType;
                storageModel.LogicalTypeName = elementType.name;

                var dbEntityInstanceDefinition = {};
                this._buildDbInstanceDefinition(storageModel, dbEntityInstanceDefinition);

                var dbEntityClassDefinition = {};
                dbEntityClassDefinition.convertTo = this._buildDbType_generateConvertToFunction(storageModel, this);

                storageModel.PhysicalTypeName = _index2.default.EntityContext._convertLogicalTypeNameToPhysical(storageModel.LogicalTypeName);
                storageModel.PhysicalType = _index2.default.Class.define(storageModel.PhysicalTypeName, _index2.default.Entity, storageModel.LogicalType.container, dbEntityInstanceDefinition, dbEntityClassDefinition);
                storageModel.ContextType = this.getType();

                this._storageModel.push(storageModel);
                var name = _index.Container.resolveName(elementType);
                this._storageModel[name] = storageModel;
            }

            result = this._entitySetReferences[elementType.name] = new _index2.default.EntitySet(elementType, this, elementType.name);
            result.tableName = storageModel.TableName;
        }

        //console.log(Object.keys(this._entitySetReferences), Object.keys(this._storageModel), elementType.name);
        return result;
    },
    executeQuery: function executeQuery(queryable, callBack, transaction) {
        var query = new _index2.default.Query(queryable.expression, queryable.defaultType, this);
        query.transaction = transaction instanceof _index2.default.Transaction ? transaction : undefined;
        var returnTransaction = this._isReturnTransaction(transaction);

        callBack = _index2.default.PromiseHandlerBase.createCallbackSettings(callBack);
        var that = this;
        var clbWrapper = {};
        clbWrapper.success = that.executeQuerySuccess(that, returnTransaction, callBack);
        clbWrapper.error = that.executeQueryError(that, returnTransaction, callBack);

        var sets = query.getEntitySets();

        var authorizedFn = function authorizedFn() {
            var ex = true;
            var wait = false;
            var ctx = that;

            var readyFn = function readyFn(cancel) {
                if (cancel === false) ex = false;

                if (ex) {
                    if (query.transaction) {
                        if (_index2.default.QueryCache && _index2.default.QueryCache.isInCache(that, query)) {
                            _index2.default.QueryCache.executeQuery(that, query, clbWrapper);
                        } else {
                            ctx.storageProvider.executeQuery(query, clbWrapper);
                        }
                    } else {
                        ctx.beginTransaction(function (tran) {
                            query.transaction = tran;
                            if (_index2.default.QueryCache && _index2.default.QueryCache.isInCache(that, query)) {
                                _index2.default.QueryCache.executeQuery(that, query, clbWrapper);
                            } else {
                                ctx.storageProvider.executeQuery(query, clbWrapper);
                            }
                        });
                    }
                } else {
                    query.rawDataList = [];
                    query.result = [];
                    clbWrapper.success(query);
                }
            };

            var i = 0;
            var callbackFn = function callbackFn(cancel) {
                if (cancel === false) ex = false;

                var es = sets[i];
                if (es.beforeRead) {
                    i++;
                    var r = es.beforeRead.call(this, sets, query);
                    if (typeof r === 'function') {
                        r.call(this, i < sets.length && ex ? callbackFn : readyFn, sets, query);
                    } else {
                        if (r === false) ex = false;

                        if (i < sets.length && ex) {
                            callbackFn();
                        } else readyFn();
                    }
                } else readyFn();
            };

            if (sets.length) callbackFn();else readyFn();
        };

        if (this.user && this.checkPermission) {
            this.checkPermission(query.expression.nodeType === _index2.default.Expressions.ExpressionType.BatchDelete ? _index2.default.Access.DeleteBatch : _index2.default.Access.Read, this.user, sets, {
                success: authorizedFn,
                error: clbWrapper.error
            });
        } else authorizedFn();
    },
    executeQuerySuccess: function executeQuerySuccess(that, returnTransaction, callBack) {
        return function (query) {
            if (_index2.default.QueryCache && _index2.default.QueryCache.isCacheable(that, query)) {
                _index2.default.QueryCache.addToCache(that, query);
            }

            query.buildResultSet(that);

            if (_index2.default.ItemStore && 'QueryResultModifier' in _index2.default.ItemStore) _index2.default.ItemStore.QueryResultModifier.call(that, query);

            var successResult;

            if (query.expression.nodeType === _index2.default.Expressions.ExpressionType.Single || query.expression.nodeType === _index2.default.Expressions.ExpressionType.Find || query.expression.nodeType === _index2.default.Expressions.ExpressionType.Count || query.expression.nodeType === _index2.default.Expressions.ExpressionType.BatchDelete || query.expression.nodeType === _index2.default.Expressions.ExpressionType.Some || query.expression.nodeType === _index2.default.Expressions.ExpressionType.Every) {
                if (query.result.length !== 1) {
                    callBack.error(new _index.Exception('result count failed'));
                    return;
                }

                successResult = query.result[0];
            } else if (query.expression.nodeType === _index2.default.Expressions.ExpressionType.First) {
                if (query.result.length === 0) {
                    callBack.error(new _index.Exception('result count failed'));
                    return;
                }

                successResult = query.result[0];
            } else {
                if (typeof query.__count === 'number' && query.result) query.result.totalCount = query.__count;

                that.storageProvider._buildContinuationFunction(that, query);

                successResult = query.result;
            }

            var readyFn = function readyFn() {
                that._applyTransaction(callBack, callBack.success, [successResult], query.transaction, returnTransaction);

                /*if (returnTransaction === true) {
                    if (query.transaction)
                        callBack.success(successResult, query.transaction);
                    else {
                        that.beginTransaction(function (tran) {
                            callBack.success(successResult, tran);
                        });
                    }
                }
                else
                    callBack.success(successResult);*/
            };

            var i = 0;
            var sets = query.getEntitySets();

            var callbackFn = function callbackFn() {
                var es = sets[i];
                if (es.afterRead) {
                    i++;
                    var r = es.afterRead.call(this, successResult, sets, query);
                    if (typeof r === 'function') {
                        r.call(this, i < sets.length ? callbackFn : readyFn, successResult, sets, query);
                    } else {
                        if (i < sets.length) {
                            callbackFn();
                        } else readyFn();
                    }
                } else readyFn();
            };

            if (sets.length) callbackFn();else readyFn();
        };
    },
    executeQueryError: function executeQueryError(that, returnTransaction, callBack) {
        return function () {
            if (returnTransaction) callBack.error.apply(this, arguments);else callBack.error.apply(this, Array.prototype.filter.call(arguments, function (p) {
                return !(p instanceof _index2.default.Transaction);
            }));
        };
    },

    batchExecuteQuery: function batchExecuteQuery(queryableOptions, callBack, transaction) {
        var pHandler = new _index2.default.PromiseHandler();
        var cbWrapper = pHandler.createCallback(callBack);

        var self = this;
        var methodOperationMappings = {
            count: 'length',
            length: 'length',
            forEach: 'forEach',
            toArray: 'toArray',
            single: 'single',
            some: 'some',
            every: 'every',
            first: 'first',
            removeAll: 'batchDelete'
        };
        var methodFrameMappings = {
            count: 'CountExpression',
            length: 'CountExpression',
            forEach: 'ForEachExpression',
            toArray: 'ToArrayExpression',
            single: 'SingleExpression',
            some: 'SomeExpression',
            every: 'EveryExpression',
            first: 'FirstExpression',
            removeAll: 'BatchDeleteExpression'
        };

        var returnFunc = function returnFunc() {
            return pHandler.getPromise();
        };

        if (typeof queryableOptions.length != "number") {
            cbWrapper.error(new _index.Exception('QueryableOptions array parameter missing', 'Invalid arguments'));
            return returnFunc();
        }

        var qOptions = [];
        for (var i = 0; i < queryableOptions.length; i++) {
            var queryOption = {};
            if (queryableOptions[i] instanceof _index2.default.Queryable) {
                queryOption.queryable = queryableOptions[i];
                queryOption.method = 'toArray';
            } else if (queryableOptions[i].queryable instanceof _index2.default.Queryable) {
                queryOption.queryable = queryableOptions[i].queryable;
                queryOption.method = queryableOptions[i].method || 'toArray';
            } else if (queryableOptions[i][0] instanceof _index2.default.Queryable) {
                queryOption.queryable = queryableOptions[i][0];
                queryOption.method = queryableOptions[i][1] || 'toArray';
            } else {
                cbWrapper.error(new _index.Exception('$data.Queryable is missing in queryableOptions at index ' + i, 'Invalid arguments'));
                return returnFunc();
            }

            if (queryOption.queryable.entityContext !== self) {
                cbWrapper.error(new _index.Exception('Queryable at index ' + i + ' contains different entity context', 'Invalid arguments'));
                return returnFunc();
            }

            queryOption.queryable._checkOperation(methodOperationMappings[queryOption.method] || queryOption.method);
            qOptions.push(queryOption);
        }

        var executableQueries = [];
        for (var i = 0; i < qOptions.length; i++) {
            var queryOption = qOptions[i];

            var frameExpressionName = methodFrameMappings[queryOption.method] || queryOption.method;
            if (frameExpressionName && _index2.default.Expressions[frameExpressionName] && _index2.default.Expressions[frameExpressionName].isAssignableTo(_index2.default.Expressions.FrameOperator)) {

                var queryExpression = _index.Container['create' + frameExpressionName](queryOption.queryable.expression);
                var preparator = _index.Container.createQueryExpressionCreator(queryOption.queryable.entityContext);

                try {
                    var expression = preparator.Visit(queryExpression);
                    queryOption.queryable.entityContext.log({ event: "EntityExpression", data: expression });

                    var queryable = _index.Container.createQueryable(queryOption.queryable, expression);
                    executableQueries.push(queryable);
                } catch (e) {
                    cbWrapper.error(e);
                    return returnFunc();
                }
            } else {
                cbWrapper.error(new _index.Exception('Invalid frame method \'' + frameExpressionName + '\' in queryableOptions at index ' + i, 'Invalid arguments'));
                return returnFunc();
            }
        }

        var queryResults = [];
        if (self.storageProvider.supportedContextOperation && self.storageProvider.supportedContextOperation.batchExecuteQuery) {
            //wrap queries
            var batchExecuteQueryExpression = _index.Container.createBatchExecuteQueryExpression(executableQueries.map(function (queryable) {
                return new _index2.default.Query(queryable.expression, queryable.defaultType, self);
            }));

            var batchExecuteQuery = _index.Container.createQueryable(self, batchExecuteQueryExpression);
            self.executeQuery(batchExecuteQuery, {
                success: function success(results) {
                    var batchResult = [];
                    var hasError = false;
                    var errorValue = null;
                    for (var i = 0; i < results.length && !hasError; i++) {
                        var query = results[i];
                        self.executeQuerySuccess(self, returnTransaction, {
                            success: function success(result) {
                                batchResult.push(result);
                            },
                            error: function error(err) {
                                hasError = true;
                                errorValue = err;
                            }
                        })(query);
                    }
                    if (!hasError) {
                        self._applyTransaction(cbWrapper, cbWrapper.success, [batchResult], batchExecuteQuery.transaction, returnTransaction);
                    } else {
                        cbWrapper.error(errorValue);
                    }
                },
                error: cbWrapper.error
            }, transaction);
        } else {
            var returnTransaction = this._isReturnTransaction(transaction);

            var readIterator = function readIterator(queries, index, iteratorCallback, itTransaction) {
                var query = queries[index];
                if (!query) {
                    return iteratorCallback.success(itTransaction);
                }

                self.executeQuery(executableQueries[index], {
                    success: function success(result, tr) {
                        queryResults.push(result);
                        readIterator(executableQueries, index + 1, iteratorCallback, tr);
                    },
                    error: iteratorCallback.error
                }, itTransaction);
            };

            readIterator(executableQueries, 0, {
                success: function success(lastTran) {
                    self._applyTransaction(cbWrapper, cbWrapper.success, [queryResults], lastTran, returnTransaction);
                },
                error: cbWrapper.error
            }, transaction);
        }
        return returnFunc();
    },

    /**
     * Saves the changes made to the context.
     *
     * @memberof $data.EntityContext
     * @instance
     * @param {Function|Object} callback - callback function or callback object with success & error properties
     * @param {$data.Transaction} transaction - Transaction object
     * @returns $.Deferred
     *
     * @example <caption>saveChanges with simple callback function</caption>
     * context.saveChanges(function(db) {
     *  //success
     * });
     *
     * @example <caption>saveChanges with callback object</caption>
     * var myCallback = {
     *  success: function(db) { //succeess },
     *  error: function(errors) { console.log(errors); }
     * }
     * context.saveChanges(myCallback);
     */
    saveChanges: function saveChanges(callback, transaction) {
        if (_index2.default.QueryCache) {
            _index2.default.QueryCache.reset(this);
        }

        var changedEntities = [];
        var trackedEntities = this.stateManager.trackedEntities;
        var pHandler = new _index2.default.PromiseHandler();
        var clbWrapper = pHandler.createCallback(callback);
        var pHandlerResult = pHandler.getPromise();
        var returnTransaction = this._isReturnTransaction(transaction);

        var skipItems = [];
        while (trackedEntities.length > 0) {
            var additionalEntities = [];
            //trackedEntities.forEach(function (entityCachedItem) {
            for (var i = 0; i < trackedEntities.length; i++) {
                var entityCachedItem = trackedEntities[i];

                var sModel = this._storageModel.getStorageModel(entityCachedItem.data.getType());
                if (entityCachedItem.data.entityState == _index2.default.EntityState.Unchanged) {
                    entityCachedItem.skipSave = true;
                    skipItems.push(entityCachedItem.data);
                } else {
                    if (entityCachedItem.data.entityState == _index2.default.EntityState.Modified) {
                        if (entityCachedItem.data.changedProperties) {
                            var changeStoredProperty = entityCachedItem.data.changedProperties.some(function (p) {
                                var pMemDef = sModel.PhysicalType.memberDefinitions.getMember(p.name);
                                if (pMemDef.kind == _index2.default.MemberTypes.navProperty) {
                                    var a = sModel.Associations[pMemDef.association];
                                    var multiplicity = a.FromMultiplicity + a.ToMultiplicity;
                                    return multiplicity == '*0..1' || multiplicity == '0..11';
                                }
                                return true;
                            });
                            if (!changeStoredProperty) {
                                entityCachedItem.skipSave = true;
                                skipItems.push(entityCachedItem.data);
                            }
                        } else {
                            entityCachedItem.skipSave = true;
                            skipItems.push(entityCachedItem.data);
                        }
                    }
                }

                var navigationProperties = [];
                var complexProperties = [];
                var smPhyMemDefs = sModel.PhysicalType.memberDefinitions.asArray();
                for (var ism = 0; ism < smPhyMemDefs.length; ism++) {
                    var p = smPhyMemDefs[ism];
                    if (p.kind == _index2.default.MemberTypes.navProperty) navigationProperties.push(p);
                    if (p.kind == _index2.default.MemberTypes.complexProperty) complexProperties.push(p);
                }

                for (var j = 0; j < complexProperties.length; j++) {
                    var complexProp = complexProperties[j];
                    var name = complexProp.name;
                    var connectedDataList = [].concat(entityCachedItem.data[name]);
                    for (var k = 0; k < connectedDataList.length; k++) {
                        var data = connectedDataList[k];

                        if (data && data.changedProperties && data.changedProperties.length > 0) {
                            entityCachedItem.data._setPropertyChanged(complexProp);
                            if (entityCachedItem.skipSave) {
                                delete entityCachedItem.skipSave;
                                skipItems.splice(skipItems.indexOf(entityCachedItem.data), 1);
                            }
                            this.discoverDependentItemEntityState(entityCachedItem.data);
                        }
                    }
                }

                //type before events with items
                this.processEntityTypeBeforeEventHandler(skipItems, entityCachedItem);

                //var navigationProperties = sModel.PhysicalType.memberDefinitions.asArray().filter(function (p) { return p.kind == $data.MemberTypes.navProperty; });
                //navigationProperties.forEach(function (navProp) {
                for (var j = 0; j < navigationProperties.length; j++) {
                    var navProp = navigationProperties[j];

                    var association = sModel.Associations[navProp.name]; //eg.:"Profile"
                    var name = navProp.name; //eg.: "Profile"
                    var navPropertyName = association.ToPropertyName; //eg.: User

                    var connectedDataList = [].concat(entityCachedItem.data[name]);
                    //connectedDataList.forEach(function (data) {
                    for (var k = 0; k < connectedDataList.length; k++) {
                        var data = connectedDataList[k];

                        if (data) {
                            var value = data[navPropertyName];
                            var associationType = association.FromMultiplicity + association.ToMultiplicity;
                            if (association.FromMultiplicity === '$$unbound') {
                                if (data instanceof _index2.default.Array) {
                                    entityCachedItem.dependentOn = entityCachedItem.dependentOn || [];
                                    //data.forEach(function (dataItem) {
                                    for (var l = 0; l < data.length; l++) {
                                        var dataItem = data[l];

                                        if (entityCachedItem.dependentOn.indexOf(data) < 0 && data.skipSave !== true) {
                                            entityCachedItem.dependentOn.push(data);
                                        }
                                    }
                                    //}, this);
                                } else {
                                    entityCachedItem.dependentOn = entityCachedItem.dependentOn || [];
                                    if (entityCachedItem.dependentOn.indexOf(data) < 0 && data.skipSave !== true) {
                                        entityCachedItem.dependentOn.push(data);
                                    }
                                }
                            } else {
                                switch (associationType) {
                                    case "*0..1":
                                        //Array
                                        if (value) {
                                            if (value instanceof Array) {
                                                if (value.indexOf(entityCachedItem.data) == -1) {
                                                    value.push(entityCachedItem.data);
                                                    data.initData[navPropertyName] = value;
                                                    data._setPropertyChanged(association.ToType.getMemberDefinition(navPropertyName));
                                                }
                                            } else {
                                                if (typeof intellisense === 'undefined') {
                                                    _index.Guard.raise("Item must be array or subtype of array");
                                                }
                                            }
                                        } else {
                                            data.initData[navPropertyName] = [entityCachedItem.data];
                                            data._setPropertyChanged(association.ToType.getMemberDefinition(navPropertyName));
                                        }
                                        break;
                                    default:
                                        //Item
                                        if (value) {
                                            if (value !== entityCachedItem.data) {
                                                if (typeof intellisense === 'undefined') {
                                                    _index.Guard.raise("Integrity check error! Item assigned to another entity!");
                                                }
                                            }
                                        } else {
                                            data.initData[navPropertyName] = entityCachedItem.data; //set back reference for live object
                                            data._setPropertyChanged(association.ToType.getMemberDefinition(navPropertyName));
                                        }
                                        break;
                                }
                                switch (associationType) {
                                    case "*0..1":
                                    case "0..11":
                                        entityCachedItem.dependentOn = entityCachedItem.dependentOn || [];
                                        if (entityCachedItem.dependentOn.indexOf(data) < 0 && data.skipSave !== true) {
                                            entityCachedItem.dependentOn.push(data);
                                        }
                                        break;
                                }
                            }
                            if (!data.entityState) {
                                //if (data.storeToken === this.storeToken) {
                                //    data.entityState = $data.EntityState.Modified;
                                //} else {
                                //    data.entityState = $data.EntityState.Added;
                                //}
                                this.discoverDependentItemEntityState(data);
                            }
                            if (additionalEntities.indexOf(data) == -1) {
                                additionalEntities.push(data);
                            }
                        }
                    }
                    //}, this);
                }
                //}, this);
            }
            //}, this);

            //trackedEntities.forEach(function (entity) {
            for (var i = 0; i < trackedEntities.length; i++) {
                var entity = trackedEntities[i];

                if (entity.skipSave !== true) {
                    changedEntities.push(entity);
                }
            }
            //});

            trackedEntities = [];
            //additionalEntities.forEach(function (item) {
            for (var i = 0; i < additionalEntities.length; i++) {
                var item = additionalEntities[i];

                if (!skipItems.some(function (entity) {
                    return entity == item;
                })) {
                    if (!changedEntities.some(function (entity) {
                        return entity.data == item;
                    })) {
                        trackedEntities.push({ data: item, entitySet: this.getEntitySetFromElementType(item.getType().name) });
                    }
                }
            }
            //}, this);
        }

        //changedEntities.forEach(function (d) {
        for (var j = 0; j < changedEntities.length; j++) {
            var d = changedEntities[j];

            if (d.dependentOn) {
                var temp = [];
                for (var i = 0; i < d.dependentOn.length; i++) {
                    if (skipItems.indexOf(d.dependentOn[i]) < 0) {
                        temp.push(d.dependentOn[i]);
                    } else {
                        d.additionalDependentOn = d.additionalDependentOn || [];
                        d.additionalDependentOn.push(d.dependentOn[i]);
                    }
                }
                d.dependentOn = temp;
            }
        }
        //});
        skipItems = null;
        var ctx = this;
        if (changedEntities.length == 0) {
            this.stateManager.trackedEntities.length = 0;
            ctx._applyTransaction(clbWrapper, clbWrapper.success, [0], transaction, returnTransaction);

            /*if (returnTransaction) {
                clbWrapper.success(0, transaction);
            } else {
                clbWrapper.success(0);
            }*/
            return pHandlerResult;
        }

        //validate entities
        var errors = [];
        //changedEntities.forEach(function (entity) {
        for (var i = 0; i < changedEntities.length; i++) {
            var entity = changedEntities[i];

            if (entity.data.entityState === _index2.default.EntityState.Added) {
                //entity.data.getType().memberDefinitions.getPublicMappedProperties().forEach(function (memDef) {
                for (var j = 0; j < entity.data.getType().memberDefinitions.getPublicMappedProperties().length; j++) {
                    var memDef = entity.data.getType().memberDefinitions.getPublicMappedProperties()[j];

                    var memDefType = _index.Container.resolveType(memDef.type);
                    if (memDef.required && !memDef.computed && !entity.data[memDef.name] && !memDef.isDependentProperty) {
                        switch (memDefType) {
                            case _index2.default.String:
                            case _index2.default.Number:
                            case _index2.default.Float:
                            case _index2.default.Decimal:
                            case _index2.default.Integer:
                            case _index2.default.Int16:
                            case _index2.default.Int32:
                            case _index2.default.Int64:
                            case _index2.default.Byte:
                            case _index2.default.SByte:
                            case _index2.default.Date:
                            case _index2.default.Boolean:
                                entity.data[memDef.name] = _index.Container.getDefault(memDef.dataType);
                                break;
                            default:
                                break;
                        }
                    }
                }
                //}, this);
            }
            if ((entity.data.entityState === _index2.default.EntityState.Added || entity.data.entityState === _index2.default.EntityState.Modified) && !entity.data.isValid()) {
                errors.push({ item: entity.data, errors: entity.data.ValidationErrors });
            }
        }
        //});
        if (errors.length > 0) {
            clbWrapper.error(errors);
            return pHandlerResult;
        }

        var access = _index2.default.Access.None;

        var eventData = {};
        var sets = [];
        for (var i = 0; i < changedEntities.length; i++) {
            var it = changedEntities[i];
            var n = it.entitySet.elementType.name;
            if (sets.indexOf(it.entitySet) < 0) sets.push(it.entitySet);
            var es = this._entitySetReferences[n];
            if (es.beforeCreate || es.beforeUpdate || es.beforeDelete || this.user && this.checkPermission) {
                if (!eventData[n]) eventData[n] = {};

                switch (it.data.entityState) {
                    case _index2.default.EntityState.Added:
                        access |= _index2.default.Access.Create;
                        if (es.beforeCreate) {
                            if (!eventData[n].createAll) eventData[n].createAll = [];
                            eventData[n].createAll.push(it);
                        }
                        break;
                    case _index2.default.EntityState.Modified:
                        access |= _index2.default.Access.Update;
                        if (es.beforeUpdate) {
                            if (!eventData[n].modifyAll) eventData[n].modifyAll = [];
                            eventData[n].modifyAll.push(it);
                        }
                        break;
                    case _index2.default.EntityState.Deleted:
                        access |= _index2.default.Access.Delete;
                        if (es.beforeDelete) {
                            if (!eventData[n].deleteAll) eventData[n].deleteAll = [];
                            eventData[n].deleteAll.push(it);
                        }
                        break;
                }
            }
        }

        var readyFn = function readyFn(cancel) {
            if (cancel === false) {
                cancelEvent = 'async';
                changedEntities.length = 0;
            }

            if (changedEntities.length) {
                //console.log('changedEntities: ', changedEntities.map(function(it){ return it.data.initData; }));

                var innerCallback = {
                    success: function success(tran) {
                        ctx._postProcessSavedItems(clbWrapper, changedEntities, tran, returnTransaction);
                    },
                    error: function error() {
                        //TODO remove trans from args;
                        if (returnTransaction) clbWrapper.error.apply(this, arguments);else clbWrapper.error.apply(this, Array.prototype.filter.call(arguments, function (p) {
                            return !(p instanceof _index2.default.Transaction);
                        }));
                    }
                };

                if (transaction instanceof _index2.default.Transaction) {
                    ctx.storageProvider.saveChanges(innerCallback, changedEntities, transaction);
                } else {
                    ctx.beginTransaction(true, function (tran) {
                        ctx.storageProvider.saveChanges(innerCallback, changedEntities, tran);
                    });
                }
            } else if (cancelEvent) {
                clbWrapper.error(new _index.Exception('Cancelled event in ' + cancelEvent, 'CancelEvent'));
            } else {
                ctx._applyTransaction(clbWrapper, clbWrapper.success, [0], transaction, returnTransaction);

                /*if(returnTransaction)
                    clbWrapper.success(0, transaction);
                else
                    clbWrapper.success(0);*/
            };

            /*else if (cancelEvent) clbWrapper.error(new $data.Exception('saveChanges cancelled from event [' + cancelEvent + ']'));
            else Guard.raise('No changed entities');*/
        };

        var cancelEvent;
        var ies = Object.getOwnPropertyNames(eventData);
        var i = 0;
        var cmd = ['beforeUpdate', 'beforeDelete', 'beforeCreate'];
        var cmdAll = {
            beforeCreate: 'createAll',
            beforeDelete: 'deleteAll',
            beforeUpdate: 'modifyAll'
        };

        var callbackFn = function callbackFn(cancel) {
            if (cancel === false) {
                cancelEvent = 'async';
                changedEntities.length = 0;

                readyFn(cancel);
                return;
            }

            var es = ctx._entitySetReferences[ies[i]];
            var c = cmd.pop();
            var ed = eventData[ies[i]];
            var all = ed[cmdAll[c]];

            if (all) {
                var m = [];
                for (var im = 0; im < all.length; im++) {
                    m.push(all[im].data);
                }
                //var m = all.map(function(it){ return it.data; });
                if (!cmd.length) {
                    cmd = ['beforeUpdate', 'beforeDelete', 'beforeCreate'];
                    i++;
                }

                var r = es[c].call(ctx, m);
                if (typeof r === 'function') {
                    r.call(ctx, i < ies.length && !cancelEvent ? callbackFn : readyFn, m);
                } else if (r === false) {
                    cancelEvent = es.name + '.' + c;
                    //all.forEach(function (it) {
                    for (var index = 0; index < all.length; index++) {
                        var it = all[index];

                        var ix = changedEntities.indexOf(it);
                        changedEntities.splice(ix, 1);
                    }
                    //});

                    readyFn();
                } else {
                    if (i < ies.length && !cancelEvent) callbackFn();else readyFn();
                }
            } else {
                if (!cmd.length) {
                    cmd = ['beforeUpdate', 'beforeDelete', 'beforeCreate'];
                    i++;
                }

                if (i < ies.length && !cancelEvent) callbackFn();else readyFn();
            }
        };

        if (this.user && this.checkPermission) {
            this.checkPermission(access, this.user, sets, {
                success: function success() {
                    if (i < ies.length) callbackFn();else readyFn();
                },
                error: clbWrapper.error
            });
        } else {
            if (i < ies.length) callbackFn();else readyFn();
        }

        return pHandlerResult;
    },
    discoverDependentItemEntityState: function discoverDependentItemEntityState(data) {
        if (data.entityState && data.entityState !== _index2.default.EntityState.Unchanged) return;
        if (data.storeToken === this.storeToken) {
            data.entityState = data.changedProperties && data.changedProperties.length ? _index2.default.EntityState.Modified : _index2.default.EntityState.Unchanged;
        } else if (data.storeToken && this.storeToken && data.storeToken.typeName === this.storeToken.typeName && JSON.stringify(data.storeToken.args) === JSON.stringify(this.storeToken.args)) {
            data.entityState = data.changedProperties && data.changedProperties.length ? _index2.default.EntityState.Modified : _index2.default.EntityState.Unchanged;
        } else {
            data.entityState = _index2.default.EntityState.Added;
        }
    },

    processEntityTypeBeforeEventHandler: function processEntityTypeBeforeEventHandler(skipItems, entityCachedItem) {
        if (!entityCachedItem.skipSave) {
            var entity = entityCachedItem.data;
            var entityType = entity.getType();
            var state = entity.entityState;

            switch (true) {
                case state === _index2.default.EntityState.Added && entityType.onbeforeCreate instanceof _index2.default.Event:
                    if (entityType.onbeforeCreate.fireCancelAble(entity) === false) {
                        entityCachedItem.skipSave = true;
                        skipItems.push(entity);
                    }
                    break;
                case state === _index2.default.EntityState.Modified && entityType.onbeforeUpdate instanceof _index2.default.Event:
                    if (entityType.onbeforeUpdate.fireCancelAble(entity) === false) {
                        entityCachedItem.skipSave = true;
                        skipItems.push(entity);
                    }
                    break;
                case state === _index2.default.EntityState.Deleted && entityType.onbeforeDelete instanceof _index2.default.Event:
                    if (entityType.onbeforeDelete.fireCancelAble(entity) === false) {
                        entityCachedItem.skipSave = true;
                        skipItems.push(entity);
                    }
                    break;
                default:
                    break;
            }
        }
    },
    processEntityTypeAfterEventHandler: function processEntityTypeAfterEventHandler(entityCachedItem) {
        var entity = entityCachedItem.data;
        var entityType = entity.getType();
        var state = entity.entityState;

        switch (true) {
            case state === _index2.default.EntityState.Added && entityType.onafterCreate instanceof _index2.default.Event:
                entityType.onafterCreate.fire(entity);
                break;
            case state === _index2.default.EntityState.Modified && entityType.onafterUpdate instanceof _index2.default.Event:
                entityType.onafterUpdate.fire(entity);
                break;
            case state === _index2.default.EntityState.Deleted && entityType.onafterDelete instanceof _index2.default.Event:
                entityType.onafterDelete.fire(entity);
                break;
            default:
                break;
        }
    },

    bulkInsert: function bulkInsert(entitySet, fields, datas, callback) {
        var pHandler = new _index2.default.PromiseHandler();
        callback = pHandler.createCallback(callback);
        if (typeof entitySet === 'string') {
            var currentEntitySet;

            for (var entitySetName in this._entitySetReferences) {
                var actualEntitySet = this._entitySetReferences[entitySetName];
                if (actualEntitySet.tableName === entitySet) {
                    currentEntitySet = actualEntitySet;
                    break;
                }
            }

            if (!currentEntitySet) currentEntitySet = this[entitySet];

            entitySet = currentEntitySet;
        }
        if (entitySet) {
            this.storageProvider.bulkInsert(entitySet, fields, datas, callback);
        } else {
            callback.error(new _index.Exception('EntitySet not found'));
        }
        return pHandler.getPromise();
    },

    prepareRequest: function prepareRequest() {},
    _postProcessSavedItems: function _postProcessSavedItems(callBack, changedEntities, transaction, returnTransaction) {
        if (this.ChangeCollector && this.ChangeCollector instanceof _index2.default.Notifications.ChangeCollectorBase) this.ChangeCollector.processChangedData(changedEntities);

        var eventData = {};
        var ctx = this;
        //changedEntities.forEach(function (entity) {
        for (var i = 0; i < changedEntities.length; i++) {
            var entity = changedEntities[i];

            if (!entity.data.storeToken) entity.data.storeToken = ctx.storeToken;

            //type after events with items
            this.processEntityTypeAfterEventHandler(entity);

            var oes = entity.data.entityState;

            entity.data.entityState = _index2.default.EntityState.Unchanged;
            entity.data.changedProperties = [];
            entity.physicalData = undefined;

            var n = entity.entitySet.elementType.name;
            var es = ctx._entitySetReferences[n];

            var eventName = undefined;
            switch (oes) {
                case _index2.default.EntityState.Added:
                    eventName = 'added';
                    break;
                case _index2.default.EntityState.Deleted:
                    eventName = 'deleted';
                    break;
                case _index2.default.EntityState.Modified:
                    eventName = 'updated';
                    break;
            }
            if (eventName) {
                this.raiseEvent(eventName, entity);
            }

            if (es.afterCreate || es.afterUpdate || es.afterDelete) {
                if (!eventData[n]) eventData[n] = {};

                switch (oes) {
                    case _index2.default.EntityState.Added:
                        if (es.afterCreate) {
                            if (!eventData[n].createAll) eventData[n].createAll = [];
                            eventData[n].createAll.push(entity);
                        }
                        break;
                    case _index2.default.EntityState.Modified:
                        if (es.afterUpdate) {
                            if (!eventData[n].modifyAll) eventData[n].modifyAll = [];
                            eventData[n].modifyAll.push(entity);
                        }
                        break;
                    case _index2.default.EntityState.Deleted:
                        if (es.afterDelete) {
                            if (!eventData[n].deleteAll) eventData[n].deleteAll = [];
                            eventData[n].deleteAll.push(entity);
                        }
                        break;
                }
            }
        }
        //});

        var ies = Object.getOwnPropertyNames(eventData);
        var i = 0;
        var ctx = this;
        var cmd = ['afterUpdate', 'afterDelete', 'afterCreate'];
        var cmdAll = {
            afterCreate: 'createAll',
            afterDelete: 'deleteAll',
            afterUpdate: 'modifyAll'
        };

        var readyFn = function readyFn() {
            if (!ctx.trackChanges) {
                ctx.stateManager.reset();
            }

            ctx._applyTransaction(callBack, callBack.success, [changedEntities.length], transaction, returnTransaction);

            /*if (returnTransaction)
                callBack.success(changedEntities.length, transaction);
            else
                callBack.success(changedEntities.length);*/
        };

        var callbackFn = function callbackFn() {
            var es = ctx._entitySetReferences[ies[i]];
            var c = cmd.pop();
            var ed = eventData[ies[i]];
            var all = ed[cmdAll[c]];
            if (all) {
                var m = [];
                for (var im = 0; im < all.length; im++) {
                    m.push(all[im].data);
                }
                //var m = all.map(function(it){ return it.data; });
                if (!cmd.length) {
                    cmd = ['afterUpdate', 'afterDelete', 'afterCreate'];
                    i++;
                }

                var r = es[c].call(ctx, m);
                if (typeof r === 'function') {
                    r.call(ctx, i < ies.length ? callbackFn : readyFn, m);
                } else {
                    if (i < ies.length) callbackFn();else readyFn();
                }
            } else {
                if (!cmd.length) {
                    cmd = ['afterUpdate', 'afterDelete', 'afterCreate'];
                    i++;
                }

                if (i < ies.length) callbackFn();else readyFn();
            }
        };

        if (i < ies.length) callbackFn();else readyFn();
    },
    forEachEntitySet: function forEachEntitySet(fn, ctx) {
        /// <summary>
        ///     Iterates over the entity sets' of current EntityContext.
        /// </summary>
        /// <param name="fn" type="Function">
        ///     <param name="entitySet" type="$data.EntitySet" />
        /// </param>
        /// <param name="ctx">'this' argument for the 'fn' function.</param>
        for (var entitySetName in this._entitySetReferences) {
            var actualEntitySet = this._entitySetReferences[entitySetName];
            fn.call(ctx, actualEntitySet);
        }
    },

    loadItemProperty: function loadItemProperty(entity, property, callback, transaction) {
        /// <signature>
        ///     <summary>Loads a property of the entity through the storage provider.</summary>
        ///     <param name="entity" type="$data.Entity">Entity object</param>
        ///     <param name="property" type="String">Property name</param>
        ///     <param name="callback" type="Function">
        ///         <summary>C  allback function</summary>
        ///         <param name="propertyValue" />
        ///     </param>
        ///     <returns type="$.Deferred" />
        /// </signature>
        /// <signature>
        ///     <summary>Loads a property of the entity through the storage provider.</summary>
        ///     <param name="entity" type="$data.Entity">Entity object</param>
        ///     <param name="property" type="String">Property name</param>
        ///     <param name="callbacks" type="Object">
        ///         Success and error callbacks definition.
        ///         Example: [code]{ success: function(db) { .. }, error: function() { .. } }[/code]
        ///     </param>
        ///     <returns type="$.Deferred" />
        /// </signature>
        /// <signature>
        ///     <summary>Loads a property of the entity through the storage provider.</summary>
        ///     <param name="entity" type="$data.Entity">Entity object</param>
        ///     <param name="property" type="MemberDefinition">Property definition</param>
        ///     <param name="callback" type="Function">
        ///         <summary>Callback function</summary>
        ///         <param name="propertyValue" />
        ///     </param>
        ///     <returns type="$.Deferred" />
        /// </signature>
        /// <signature>
        ///     <summary>Loads a property of the entity through the storage provider.</summary>
        ///     <param name="entity" type="$data.Entity">Entity object</param>
        ///     <param name="property" type="MemberDefinition">Property definition</param>
        ///     <param name="callbacks" type="Object">
        ///         Success and error callbacks definition.
        ///         Example: [code]{ success: function(db) { .. }, error: function() { .. } }[/code]
        ///     </param>
        ///     <returns type="$.Deferred" />
        /// </signature>
        _index.Guard.requireType('entity', entity, _index2.default.Entity);

        var memberDefinition = typeof property === 'string' ? entity.getType().memberDefinitions.getMember(property) : property;
        var returnTransaction = this._isReturnTransaction(transaction);

        if (entity[memberDefinition.name] != undefined) {

            var pHandler = new _index2.default.PromiseHandler();
            var callBack = pHandler.createCallback(callback);
            this._applyTransaction(callback, callback.success, [entity[memberDefinition.name]], transaction, returnTransaction);
            /*if (returnTransaction)
                callback.success(entity[memberDefinition.name], transaction);
            else
                callback.success(entity[memberDefinition.name]);*/

            return pHandler.getPromise();
        }

        var isSingleSide = true;
        var storageModel = this._storageModel.getStorageModel(entity.getType().fullName);
        var elementType = _index.Container.resolveType(memberDefinition.dataType);
        if (elementType === _index2.default.Array || elementType.isAssignableTo && elementType.isAssignableTo(_index2.default.EntitySet)) {
            elementType = _index.Container.resolveType(memberDefinition.elementType);

            isSingleSide = false;
        } else {
            var associations;
            for (var i = 0; i < storageModel.Associations.length; i++) {
                var assoc = storageModel.Associations[i];
                if (assoc.FromPropertyName == memberDefinition.name) {
                    associations = assoc;
                    break;
                }
            }
            //var associations = storageModel.Associations.filter(function (assoc) { return assoc.FromPropertyName == memberDefinition.name; })[0];
            if (associations && associations.FromMultiplicity === "0..1" && associations.ToMultiplicity === "1") isSingleSide = false;
        }

        var keyProp = storageModel.LogicalType.memberDefinitions.getKeyProperties();
        if (isSingleSide === true) {
            //singleSide

            var filterFunc = "function (e) { return";
            var filterParams = {};
            //storageModel.LogicalType.memberDefinitions.getKeyProperties().forEach(function (memDefKey, index) {
            for (var index = 0; index < keyProp.length; index++) {
                var memDefKey = keyProp[index];

                if (index > 0) filterFunc += ' &&';
                filterFunc += " e." + memDefKey.name + " == this.key" + index;
                filterParams['key' + index] = entity[memDefKey.name];
            }
            //});
            filterFunc += "; }";

            var entitySet = this.getEntitySetFromElementType(entity.getType());
            return entitySet.map('function (e) { return e.' + memberDefinition.name + ' }').single(filterFunc, filterParams, callback, transaction);
        } else {
            //multipleSide

            var filterFunc = "function (e) { return";
            var filterParams = {};
            //storageModel.LogicalType.memberDefinitions.getKeyProperties().forEach(function (memDefKey, index) {
            for (var index = 0; index < keyProp.length; index++) {
                var memDefKey = keyProp[index];

                if (index > 0) filterFunc += ' &&';
                filterFunc += " e." + memberDefinition.inverseProperty + "." + memDefKey.name + " == this.key" + index;
                filterParams['key' + index] = entity[memDefKey.name];
            }
            //});
            filterFunc += "; }";

            var entitySet = this.getEntitySetFromElementType(elementType);
            return entitySet.filter(filterFunc, filterParams).toArray(callback, transaction);
        }
    },

    getTraceString: function getTraceString(queryable) {
        /// <summary>
        /// Returns a trace string. Used for debugging purposes!
        /// </summary>
        /// <param name="queryable" type="$data.Queryable" />
        /// <returns>Trace string</returns>
        var query = new _index2.default.Query(queryable.expression, queryable.defaultType, this);
        return this.storageProvider.getTraceString(query);
    },
    log: function log(logInfo) {
        //noop as do nothing
    },

    resolveBinaryOperator: function resolveBinaryOperator(operator, expression, frameType) {
        return this.storageProvider.resolveBinaryOperator(operator, expression, frameType);
    },
    resolveUnaryOperator: function resolveUnaryOperator(operator, expression, frameType) {
        return this.storageProvider.resolveUnaryOperator(operator, expression, frameType);
    },
    resolveFieldOperation: function resolveFieldOperation(operation, expression, frameType) {
        return this.storageProvider.resolveFieldOperation(operation, expression, frameType);
    },
    resolveSetOperations: function resolveSetOperations(operation, expression, frameType) {
        return this.storageProvider.resolveSetOperations(operation, expression, frameType);
    },
    resolveTypeOperations: function resolveTypeOperations(operation, expression, frameType) {
        return this.storageProvider.resolveTypeOperations(operation, expression, frameType);
    },
    resolveContextOperations: function resolveContextOperations(operation, expression, frameType) {
        return this.storageProvider.resolveContextOperations(operation, expression, frameType);
    },

    _generateServiceOperationQueryable: function _generateServiceOperationQueryable(functionName, returnEntitySet, arg, parameters) {
        if (typeof console !== 'undefined' && console.log) console.log('Obsolate: _generateServiceOperationQueryable, $data.EntityContext');

        var params = [];
        for (var i = 0; i < parameters.length; i++) {
            var obj = {};
            obj[parameters[i]] = _index.Container.resolveType(_index.Container.getTypeName(arg[i]));
            params.push(obj);
        }

        var tempOperation = _index2.default.EntityContext.generateServiceOperation({ serviceName: functionName, returnType: _index2.default.Queryable, elementType: this[returnEntitySet].elementType, params: params });
        return tempOperation.apply(this, arg);
    },
    attach: function attach(entity, mode) {
        /// <summary>
        ///     Attaches an entity to its matching entity set.
        /// </summary>
        /// <param name="entity" type="$data.Entity" />
        /// <returns type="$data.Entity">Returns the attached entity.</returns>

        if (entity instanceof _index2.default.EntityWrapper) {
            entity = entity.getEntity();
        }
        var entitySet = this.getEntitySetFromElementType(entity.getType());
        return entitySet.attach(entity, mode);
    },
    attachOrGet: function attachOrGet(entity, mode) {
        /// <summary>
        ///     Attaches an entity to its matching entity set, or returns if it's already attached.
        /// </summary>
        /// <param name="entity" type="$data.Entity" />
        /// <returns type="$data.Entity">Returns the entity.</returns>

        if (entity instanceof _index2.default.EntityWrapper) {
            entity = entity.getEntity();
        }
        var entitySet = this.getEntitySetFromElementType(entity.getType());
        return entitySet.attachOrGet(entity, mode);
    },
    detach: function detach(entity) {
        /// <summary>
        ///     Detaches an entity from its matching entity set.
        /// </summary>
        /// <param name="entity" type="$data.Entity" />

        if (entity instanceof _index2.default.EntityWrapper) {
            entity = entity.getEntity();
        }
        var entitySet = this.getEntitySetFromElementType(entity.getType());
        return entitySet.detach(entity);
    },

    addMany: function addMany(entities) {
        /// <summary>
        ///     Adds several entities to their matching entity set.
        /// </summary>
        /// <param name="entity" type="Array" />
        /// <returns type="Array">Returns the added entities.</returns>
        var self = this;
        entities.forEach(function (entity) {
            self.add(entity);
        });
        return entities;
    },

    add: function add(entity) {
        /// <summary>
        ///     Adds a new entity to its matching entity set.
        /// </summary>
        /// <param name="entity" type="$data.Entity" />
        /// <returns type="$data.Entity">Returns the added entity.</returns>

        if (entity instanceof _index2.default.EntityWrapper) {
            entity = entity.getEntity();
        }
        var entitySet = this.getEntitySetFromElementType(entity.getType());
        return entitySet.add(entity);
    },
    remove: function remove(entity) {
        /// <summary>
        ///     Removes an entity from its matching entity set.
        /// </summary>
        /// <param name="entity" type="$data.Entity" />
        /// <returns type="$data.Entity">Returns the removed entity.</returns>

        if (entity instanceof _index2.default.EntityWrapper) {
            entity = entity.getEntity();
        }
        var entitySet = this.getEntitySetFromElementType(entity.getType());
        return entitySet.remove(entity);
    },
    storeToken: { type: Object },

    getFieldUrl: function getFieldUrl(entity, member, collection) {
        try {
            var entitySet = typeof collection === 'string' ? this[collection] : collection;
            var fieldName = typeof member === 'string' ? member : member.name;
            if (entity instanceof _index2.default.Entity) {
                entitySet = this.getEntitySetFromElementType(entity.getType());
            } else if (!_index.Guard.isNullOrUndefined(entity) && entity.constructor !== _index2.default.Object) {
                //just a single key
                var keyDef = entitySet.elementType.memberDefinitions.getKeyProperties()[0];
                var key = {};
                key[keyDef.name] = entity;
                entity = key;
            }

            //key object
            if (!(entity instanceof _index2.default.Entity)) {
                entity = new entitySet.elementType(entity);
            }

            return this.storageProvider.getFieldUrl(entity, fieldName, entitySet);
        } catch (e) {}
        return '#';
    },

    //xxxx
    _applyRelatedEntityMethodsToContext: function _applyRelatedEntityMethodsToContext() {
        if (this.storageProvider.name === "oData") {
            for (var esName in this._entitySetReferences) {
                var es = this._entitySetReferences[esName];
                var newMemberName = _index2.default.defaults.relatedEntityReadMethodPrefix + es.name;
                //EntitiySets
                if (!(newMemberName in es)) {
                    es[newMemberName] = this._relatedEntityGetMethod(es.elementType, undefined, this);
                }
                //Context
                if (!(newMemberName in this)) {
                    this[newMemberName] = this._relatedEntityGetMethod(es.elementType, undefined, this);
                }
            }
        }
    },
    _applyRelatedEntityMethodsToTypes: function _applyRelatedEntityMethodsToTypes() {
        if (this.storageProvider.name === "oData") {
            for (var esName in this._entitySetReferences) {
                //add to Type
                var elementType = this._entitySetReferences[esName].elementType;
                var members = elementType.memberDefinitions.getPublicMappedProperties();
                for (var i = 0; i < members.length; i++) {
                    var member = members[i];
                    var memberElementType = null;
                    if (member.inverseProperty && _index.Container.resolveType(member.dataType) === _index2.default.Array && (memberElementType = _index.Container.resolveType(member.elementType)) && memberElementType.isAssignableTo && memberElementType.isAssignableTo(_index2.default.Entity)) {
                        var newMemberName = _index2.default.defaults.relatedEntityReadMethodPrefix + member.name;
                        if (!elementType.getMemberDefinition(newMemberName)) {
                            elementType.addMember(newMemberName, this._relatedEntityGetMethod(memberElementType, member));
                        }
                    }
                }
            }
        }
    },
    _createRelatedEntityProxyClass: function _createRelatedEntityProxyClass(type) {
        var proxyClassName = type.namespace + _index2.default.defaults.relatedEntityProxyPrefix + type.name;
        if (!_index.Container.isTypeRegistered(proxyClassName)) {
            var definition = {};
            var members = type.memberDefinitions.getPublicMappedProperties();
            for (var i = 0; i < members.length; i++) {
                var member = members[i];
                var memberElementType = null;
                if (member.inverseProperty && _index.Container.resolveType(member.dataType) === _index2.default.Array && (memberElementType = _index.Container.resolveType(member.elementType)) && memberElementType.isAssignableTo && memberElementType.isAssignableTo(_index2.default.Entity)) {
                    var newMemberName = _index2.default.defaults.relatedEntityReadMethodPrefix + member.name;
                    definition[newMemberName] = this._relatedEntityGetMethod(memberElementType, member);
                }
            }
            _index2.default.Class.define(proxyClassName, _index2.default.RelatedEntityProxy, null, definition, null);
        }

        return _index.Container.resolveType(proxyClassName);
    },
    _relatedEntityGetMethod: function _relatedEntityGetMethod(targetType, navigation, context) {
        var that = this;
        var keys = targetType.memberDefinitions.getKeyProperties();

        return function (keyValue) {
            var proxyClass = that._createRelatedEntityProxyClass(targetType);
            if (keys.length === 1 && (typeof keyValue === 'undefined' ? 'undefined' : _typeof(keyValue)) !== 'object') {
                var keyV = {};
                keyV[keys[0].name] = keyValue;
                keyValue = keyV;
            }

            if ((typeof keyValue === 'undefined' ? 'undefined' : _typeof(keyValue)) !== 'object') {
                throw new _index.Exception('Key parameter is invalid');
            } else {
                return new proxyClass(keyValue, navigation, targetType, this, context || (this.context instanceof _index2.default.EntityContext ? this.context : undefined));
            }
        };
    }
}, {
    inheritedTypeProcessor: function inheritedTypeProcessor(type) {
        if (type.resolveForwardDeclarations) {
            type.resolveForwardDeclarations();
        }
    },
    generateServiceOperation: function generateServiceOperation(cfg) {

        var fn;
        if (cfg.serviceMethod) {
            var returnType = cfg.returnType ? _index.Container.resolveType(cfg.returnType) : {};
            if (returnType.isAssignableTo && returnType.isAssignableTo(_index2.default.Queryable)) {
                fn = cfg.serviceMethod;
            } else {
                fn = function fn() {
                    var lastParam = arguments[arguments.length - 1];

                    var pHandler = new _index2.default.PromiseHandler();
                    var cbWrapper;

                    var args = arguments;
                    if (typeof lastParam === 'function') {
                        cbWrapper = pHandler.createCallback(lastParam);
                        arguments[arguments.length - 1] = cbWrapper;
                    } else {
                        cbWrapper = pHandler.createCallback();
                        arguments.push(cbWrapper);
                    }

                    try {
                        var result = cfg.serviceMethod.apply(this, arguments);
                        if (result !== undefined) cbWrapper.success(result);
                    } catch (e) {
                        cbWrapper.error(e);
                    }

                    return pHandler.getPromise();
                };
            }
        } else {
            fn = function fn() {
                var context = this;

                var boundItem;
                if (this instanceof _index2.default.Entity) {
                    if (!cfg.method) {
                        cfg.method = 'POST';
                    }

                    if (this.context) {
                        context = this.context;
                    } else {
                        _index.Guard.raise('entity not attached into context');
                        return;
                    }

                    boundItem = {
                        data: this,
                        entitySet: context.getEntitySetFromElementType(this.getType())
                    };
                }

                var virtualEntitySet = cfg.elementType ? context.getEntitySetFromElementType(_index.Container.resolveType(cfg.elementType)) : null;

                var paramConstExpression = null;
                if (cfg.params) {
                    paramConstExpression = [];
                    for (var i = 0; i < cfg.params.length; i++) {
                        //TODO: check params type
                        for (var name in cfg.params[i]) {
                            paramConstExpression.push(_index.Container.createConstantExpression(arguments[i], _index.Container.resolveType(cfg.params[i][name]), name));
                        }
                    }
                }

                var ec = _index.Container.createEntityContextExpression(context);
                var memberdef = (boundItem ? boundItem.data : context).getType().getMemberDefinition(cfg.serviceName);
                var es = _index.Container.createServiceOperationExpression(ec, _index.Container.createMemberInfoExpression(memberdef), paramConstExpression, cfg, boundItem);

                //Get callback function
                var clb = arguments[arguments.length - 1];
                if (typeof clb !== 'function') {
                    clb = undefined;
                }

                if (virtualEntitySet) {
                    var q = _index.Container.createQueryable(virtualEntitySet, es);
                    if (clb) {
                        es.isTerminated = true;
                        return q._runQuery(clb);
                    }
                    return q;
                } else {
                    var returnType = cfg.returnType ? _index.Container.resolveType(cfg.returnType) : null;

                    var q = _index.Container.createQueryable(context, es);
                    q.defaultType = returnType || _index2.default.Object;

                    if (returnType === _index2.default.Queryable) {
                        q.defaultType = _index.Container.resolveType(cfg.elementType);
                        if (clb) {
                            es.isTerminated = true;
                            return q._runQuery(clb);
                        }
                        return q;
                    }
                    es.isTerminated = true;
                    return q._runQuery(clb);
                }
            };
        };

        var params = [];
        if (cfg.params) {
            for (var i = 0; i < cfg.params.length; i++) {
                var param = cfg.params[i];
                for (var name in param) {
                    params.push({
                        name: name,
                        type: param[name]
                    });
                }
            }
        }
        _index2.default.typeSystem.extend(fn, cfg, { params: params });

        return fn;
    },
    _convertLogicalTypeNameToPhysical: function _convertLogicalTypeNameToPhysical(name) {
        return name + '_$db$';
    },
    _storageModelCache: {
        get: function get() {
            if (!this.__storageModelCache) this.__storageModelCache = {};
            return this.__storageModelCache;
        },
        set: function set() {
            //todo exception
        }
    }
});

exports.default = _index2.default;
module.exports = exports['default'];