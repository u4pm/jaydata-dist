'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

var _oDataRequestActivities = require('./oDataRequestActivities.js');

var activities = _interopRequireWildcard(_oDataRequestActivities);

var _empty = require('./SaveStrategies/empty');

var _single = require('./SaveStrategies/single');

var _batch = require('./SaveStrategies/batch');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.defaults = _core2.default.defaults || {};
_core2.default.defaults.OData = _core2.default.defaults.OData || {};
if (!("withReferenceMethods" in _core2.default.defaults.OData)) {
    _core2.default.defaults.OData.withReferenceMethods = false;
}
if (!("disableBatch" in _core2.default.defaults.OData)) {
    _core2.default.defaults.OData.disableBatch = false;
}
if (!("eTagAny" in _core2.default.defaults.OData)) {
    _core2.default.defaults.OData.eTagAny = '*';
}
if (!("enableDeepSave" in _core2.default.defaults.OData)) {
    _core2.default.defaults.OData.enableDeepSave = false;
}
if (!("disableCompltexTypeMapping" in _core2.default.defaults.OData)) {
    _core2.default.defaults.OData.disableCompltexTypeMapping = false;
}

var _checkODataMode = function _checkODataMode(context, functionName) {
    if (typeof context.providerConfiguration[functionName] !== 'undefined') {
        return !!context.providerConfiguration[functionName];
    }
    return !!_core2.default.defaults.OData[functionName];
};

(0, _core.$C)('$data.storageProviders.oData.RequestManager', _core2.default.Base, null, {
    constructor: function constructor() {
        this._items = [];
        this._entities = [];
    },
    _items: { type: _core2.default.Array },
    _entities: { type: _core2.default.Array },
    add: function add(changedItem, request, countable) {
        var item = {
            data: changedItem,
            entity: changedItem.data,
            request: request,
            itemIndex: ++this.maxItemIndex,
            references: []
        };

        // request.headers = request.headers || {};
        // request.headers["content-Id"] = item.itemIndex; 
        request.add(new activities.SetHeaderProperty("content-Id", item.itemIndex));

        if (countable !== false) {
            this.length++;
        }

        this._entities.push(item.entity);
        this._items.push(item);

        return item;
    },
    addItemReference: function addItemReference(entity, reference) {
        var item = this.getItem(entity);
        if (item) {
            item.references.push(reference);
        }
    },
    getItemIndex: function getItemIndex(entity) {
        if (!entity) return -1;
        var idx = this._entities.indexOf(entity);
        if (idx >= 0 && !this._items[idx].removed) {
            return this._items[idx].itemIndex;
        }
        return -1;
    },
    getItem: function getItem(entity, onlyAvailable) {
        if (!entity) return null;
        var idx = this._entities.indexOf(entity);
        if (idx >= 0 && (!onlyAvailable || !this._items[idx].removed)) {
            return this._items[idx];
        }
        return null;
    },
    remove: function remove(entity) {
        var idx = this._entities.indexOf(entity);
        if (idx >= 0) {
            var item = this._items[idx];
            if (!item.removed) {
                this._items[idx].removed = true;
                this.length--;
                return true;
            }
        }
        return false;
    },
    getItems: function getItems() {
        return this._items.filter(function (it) {
            return !it.removed;
        });
    },
    getByResponse: function getByResponse(response, i) {
        //use response.headers['content-id']

        var idx = i;

        if (!this._indexCalculated) {
            this._indexCalculated = true;
            this._dataForResult = this._items.filter(function (it) {
                return !it.removed;
            });
        }

        var item = this._dataForResult[idx++];
        return item ? item.entity : null;
    },
    setProcessed: function setProcessed(entity) {
        var idx = this._entities.indexOf(entity);
        if (idx >= 0) {
            var item = this._items[idx];
            if (!item.isProcessed) {
                this._items[idx].isProcessed = true;
                return true;
            }
        }
        return false;
    },

    maxItemIndex: { value: 0 },
    length: { value: 0 }
});

(0, _core.$C)('$data.storageProviders.oData.oDataProvider', _core2.default.StorageProviderBase, null, {
    constructor: function constructor(cfg, ctx) {
        this.SqlCommands = [];
        this.context = ctx;
        this.providerConfiguration = _core2.default.typeSystem.extend({
            dbCreation: _core2.default.storageProviders.DbCreationType.DropTableIfChanged,
            oDataServiceHost: "/odata.svc",
            serviceUrl: "",
            maxDataServiceVersion: '4.0',
            dataServiceVersion: undefined,
            user: null,
            password: null,
            withCredentials: false,
            //enableJSONP: undefined,
            //useJsonLight: undefined
            //disableBatch: undefined
            //withReferenceMethods: undefined
            //enableDeepSave: undefined
            UpdateMethod: 'PATCH'
        }, cfg);

        if (typeof _core2.default.odatajs === 'undefined' || typeof _core2.default.odatajs.oData === 'undefined') {
            if (typeof odatajs === 'undefined' || typeof odatajs.oData === 'undefined') {
                _core.Guard.raise(new _core.Exception('odatajs is required', 'Not Found!'));
            } else {
                this.oData = odatajs.oData;
            }
        } else {
            this.oData = _core2.default.odatajs.oData;
        }

        //this.fixkDataServiceVersions(cfg);

        if (this.context && this.context._buildDbType_generateConvertToFunction && this.buildDbType_generateConvertToFunction) {
            this.context._buildDbType_generateConvertToFunction = this.buildDbType_generateConvertToFunction;
        }
        if (this.context && this.context._buildDbType_modifyInstanceDefinition && this.buildDbType_modifyInstanceDefinition) {
            this.context._buildDbType_modifyInstanceDefinition = this.buildDbType_modifyInstanceDefinition;
        }
    },
    fixkDataServiceVersions: function fixkDataServiceVersions(cfg) {
        if (this.providerConfiguration.dataServiceVersion > this.providerConfiguration.maxDataServiceVersion) {
            this.providerConfiguration.dataServiceVersion = this.providerConfiguration.maxDataServiceVersion;
        }

        if (this.providerConfiguration.setDataServiceVersionToMax === true) {
            this.providerConfiguration.dataServiceVersion = this.providerConfiguration.maxDataServiceVersion;
        }

        if (cfg && !cfg.UpdateMethod && this.providerConfiguration.dataServiceVersion < '3.0' || !this.providerConfiguration.dataServiceVersion) {
            this.providerConfiguration.UpdateMethod = 'MERGE';
        }
    },
    initializeStore: function initializeStore(callBack) {
        callBack = _core2.default.PromiseHandlerBase.createCallbackSettings(callBack);
        switch (this.providerConfiguration.dbCreation) {
            case _core2.default.storageProviders.DbCreationType.DropAllExistingTables:
                var that = this;
                if (this.providerConfiguration.serviceUrl) {

                    var requestData = [{
                        requestUri: that.providerConfiguration.serviceUrl + "/Delete",
                        method: 'POST'
                    }, function (d) {
                        //console.log("RESET oData database");
                        callBack.success(that.context);
                    }, function (error) {
                        callBack.success(that.context);
                    }];

                    this.appendBasicAuth(requestData[0], this.providerConfiguration.user, this.providerConfiguration.password, this.providerConfiguration.withCredentials);
                    //if (this.providerConfiguration.user) {
                    //    requestData[0].user = this.providerConfiguration.user;
                    //    requestData[0].password = this.providerConfiguration.password || "";
                    //}

                    this.context.prepareRequest.call(this, requestData);
                    this.oData.request.apply(this, requestData);
                } else {
                    callBack.success(that.context);
                }
                break;
            default:
                callBack.success(this.context);
                break;
        }
    },
    buildDbType_generateConvertToFunction: function buildDbType_generateConvertToFunction(storageModel, context) {
        return function (logicalEntity, convertedItems) {
            var dbInstance = new storageModel.PhysicalType();
            dbInstance.entityState = logicalEntity.entityState;

            storageModel.PhysicalType.memberDefinitions.getPublicMappedProperties().forEach(function (property) {
                dbInstance.initData[property.name] = logicalEntity[property.name];
            }, this);

            if (storageModel.Associations) {
                storageModel.Associations.forEach(function (association) {
                    if (association.FromMultiplicity == "*" && association.ToMultiplicity == "0..1" || association.FromMultiplicity == "0..1" && association.ToMultiplicity == "1" || association.FromMultiplicity == '$$unbound') {
                        var refValue = logicalEntity[association.FromPropertyName];
                        if ( /*refValue !== null &&*/refValue !== undefined) {
                            if (refValue instanceof _core2.default.Array) {
                                dbInstance.initData[association.FromPropertyName] = dbInstance[association.FromPropertyName] || [];
                                refValue.forEach(function (rv) {
                                    var item = convertedItems.getItem(rv, true);
                                    var contentId = item ? item.itemIndex : -1;
                                    if (rv.entityState == _core2.default.EntityState.Modified || contentId < 0) {
                                        var sMod = context._storageModel.getStorageModel(rv.getType());
                                        var tblName = sMod.TableName;
                                        var pk = '(' + context.storageProvider.getEntityKeysValue({ data: rv, entitySet: context.getEntitySetFromElementType(rv.getType()) }) + ')';
                                        dbInstance.initData[association.FromPropertyName].push({ __metadata: { uri: tblName + pk } });
                                    } else {
                                        if (contentId < 0) {
                                            _core.Guard.raise("Dependency graph error");
                                        }
                                        //dbInstance.initData[association.FromPropertyName].push({ __metadata: { uri: "$" + (contentId) } });
                                        dbInstance.initData[association.FromPropertyName].push({ __convertedRefence: item });
                                    }
                                }, this);
                            } else if (refValue === null) {
                                dbInstance.initData[association.FromPropertyName] = null;
                            } else {
                                var item = convertedItems.getItem(refValue, true);
                                var contentId = item ? item.itemIndex : -1;
                                if (refValue.entityState == _core2.default.EntityState.Modified || contentId < 0) {
                                    var sMod = context._storageModel.getStorageModel(refValue.getType());
                                    var tblName = sMod.TableName;
                                    var pk = '(' + context.storageProvider.getEntityKeysValue({ data: refValue, entitySet: context.getEntitySetFromElementType(refValue.getType()) }) + ')';
                                    dbInstance.initData[association.FromPropertyName] = { __metadata: { uri: tblName + pk } };
                                } else {
                                    if (contentId < 0) {
                                        _core.Guard.raise("Dependency graph error");
                                    }
                                    //dbInstance.initData[association.FromPropertyName] = { __metadata: { uri: "$" + (contentId) } };
                                    dbInstance.initData[association.FromPropertyName] = { __convertedRefence: item };
                                }
                            }
                        }
                    }
                }, this);
            }
            if (storageModel.ComplexTypes) {
                storageModel.ComplexTypes.forEach(function (cmpType) {
                    dbInstance.initData[cmpType.FromPropertyName] = logicalEntity[cmpType.FromPropertyName];
                }, this);
            }
            return dbInstance;
        };
    },
    buildDbType_modifyInstanceDefinition: function buildDbType_modifyInstanceDefinition() {
        return;
    },
    executeQuery: function executeQuery(query, callBack) {
        callBack = _core2.default.PromiseHandlerBase.createCallbackSettings(callBack);

        var sql = {};
        try {
            sql = this._compile(query);
        } catch (e) {
            callBack.error(e);
            return;
        }
        var schema = this.context;

        var that = this;
        var countProperty = "@odata.count";

        var requestData = [{
            requestUri: this.providerConfiguration.oDataServiceHost + sql.queryText,
            method: sql.method,
            data: sql.postData,
            headers: {}
        }, function (data, textStatus, jqXHR) {

            if (!data && textStatus.body && !sql.isBatchExecuteQuery) data = JSON.parse(textStatus.body);
            if (callBack.success) {
                var processSuccess = function processSuccess(query, data, sql) {
                    query.rawDataList = typeof data === 'string' ? [{ cnt: _core.Container.convertTo(data, _core2.default.Integer) }] : data;
                    if (sql.withInlineCount && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && (typeof data[countProperty] !== 'undefined' || 'd' in data && typeof data.d[countProperty] !== 'undefined')) {
                        query.__count = new Number(typeof data[countProperty] !== 'undefined' ? data[countProperty] : data.d[countProperty]).valueOf();
                    }
                };

                if (sql.isBatchExecuteQuery) {
                    query.rawDataList = sql.subQueries;
                    for (var i = 0; i < data.__batchResponses.length; i++) {
                        var resp = data.__batchResponses[i];

                        if (!resp.data) {
                            if (resp.body) {
                                resp.data = JSON.parse(resp.body);
                            } else {
                                callBack.error(that.parseError(resp, arguments));
                                return;
                            }
                        }

                        processSuccess(sql.subQueries[i], resp.data, sql.subQueries[i]._getComplitedData());
                    }
                } else {
                    processSuccess(query, data, sql);
                }

                callBack.success(query);
            }
        }, function (error) {
            callBack.error(that.parseError(error, arguments));
        }, sql.isBatchExecuteQuery ? this.oData.batch.batchHandler : undefined];

        if (typeof this.providerConfiguration.enableJSONP !== 'undefined') {
            requestData[0].enableJsonpCallback = this.providerConfiguration.enableJSONP;
        }
        if (typeof this.providerConfiguration.useJsonLight !== 'undefined') {
            requestData[0].useJsonLight = this.providerConfiguration.useJsonLight;
        }

        this.appendBasicAuth(requestData[0], this.providerConfiguration.user, this.providerConfiguration.password, this.providerConfiguration.withCredentials);
        //if (this.providerConfiguration.user) {
        //    requestData[0].user = this.providerConfiguration.user;
        //    requestData[0].password = this.providerConfiguration.password || "";
        //}

        this.context.prepareRequest.call(this, requestData);
        //$data.ajax(requestData);
        //OData.request(requestData, requestData.success, requestData.error);
        this.oData.request.apply(this, requestData);
    },
    _compile: function _compile(queryable, params) {
        var compiler = new _core2.default.storageProviders.oData.oDataCompiler();
        var compiled = compiler.compile(queryable);
        return compiled;
    },
    saveChanges: function saveChanges(callBack, changedItems) {
        if (changedItems.length > 0) {
            this.saveInternal(changedItems, callBack);
        } else {
            callBack.success(0);
        }
    },
    saveInternal: function saveInternal(changedItems, callBack) {
        var independentBlocks = this.buildIndependentBlocks(changedItems);
        if (_checkODataMode(this, "enableDeepSave")) {
            this._checkDeepSave(changedItems);
        }
        var convertedItems = this._buildSaveData(independentBlocks, changedItems);
        var actionMode = this.saveStrategySelector(convertedItems);
        if (actionMode) {
            actionMode.save(this, convertedItems, callBack);
        } else {
            callBack.error(new _core.Exception('Not Found', 'Save action not found'));
        }
    },
    saveStrategySelector: function saveStrategySelector(convertedItems) {
        for (var i = 0; i < this.saveStrategies.length; i++) {
            var saveAction = this.saveStrategies[i];
            if (saveAction.condition(this, convertedItems)) {
                return saveAction;
            }
        }

        return null;
    },
    saveStrategies: {
        value: [_batch.strategy, _single.strategy, _empty.strategy]
    },

    _discoverSaveOrder: function _discoverSaveOrder(changedItems) {
        var entityItems = changedItems.map(function (it) {
            return it.data;
        });
        var entityInfo = changedItems.map(function (it) {
            return { path: [], visited: false, result: true };
        });
        var entityQueue = [];
        var discoveredEntities = [];

        var process = function process(currentEntity) {
            var index = entityItems.indexOf(currentEntity);
            var changedItem = changedItems[index];
            var info = entityInfo[index];

            if (info.visited) return info.result;
            if (info.visiting) return false;

            var references = [];
            if (changedItem.referredBy) {
                references = references.concat(changedItem.referredBy);
            }
            if (changedItem.dependentOn) {
                references = references.concat(changedItem.dependentOn);
            }

            for (var i = 0; i < references.length; i++) {
                var ref = references[i];
                if (discoveredEntities.indexOf(ref) < 0) {
                    entityQueue.push(ref);
                    discoveredEntities.push(ref);
                    var refIndex = entityItems.indexOf(ref);
                    changedItems[refIndex].deepParent = currentEntity;
                }
            }
        };

        for (var i = 0; i < changedItems.length; i++) {
            var changedItem = changedItems[i];
            if (entityQueue.indexOf(changedItem.data) < 0) {
                entityQueue.push(changedItem.data);
                discoveredEntities.push(changedItem.data);
                entityInfo[i].parent = null;
            }

            while (entityQueue.length) {
                var currentItem = entityQueue.shift();
                process(currentItem);
            }
        }
    },

    _checkDeepSave: function _checkDeepSave(changedItems) {
        var entityItems = changedItems.map(function (it) {
            return it.data;
        });
        var entityInfo = changedItems.map(function (it) {
            return { path: [], visited: false, result: true };
        });

        var discover = function discover(changedItem, parent, index) {
            var info = entityInfo[index];
            if (info.visited) return info.result;
            if (info.visiting) return false;

            var references = [];
            if (changedItem.referredBy) {
                references = references.concat(changedItem.referredBy);
            }
            if (changedItem.dependentOn) {
                references = references.concat(changedItem.dependentOn);
            }

            if (references.length === 0) {
                info.visited = true;
                info.result = true;
            } else {
                info.visiting = true;

                for (var i = 0; i < references.length; i++) {
                    var entity = references[i];
                    var idx = entityItems.indexOf(entity);
                    var innerChangeItem = changedItems[idx];
                    if (!innerChangeItem) return false;
                    if (innerChangeItem === parent) continue;

                    var result = discover(innerChangeItem, changedItem, idx);
                    info.result = info.result && changedItem.data.entityState === _core2.default.EntityState.Added && (!changedItem.additionalDependentOn || changedItem.additionalDependentOn.length === 0) && result;
                }
                delete info.visiting;
                info.visited = true;
            }

            changedItem.enableDeepSave = info.result;
            return info.result;
        };

        for (var i = 0; i < changedItems.length; i++) {
            var changedItem = changedItems[i];
            discover(changedItem, null, i);
        }

        this._discoverSaveOrder(changedItems);
    },

    _buildSaveData: function _buildSaveData(independentBlocks, changedItems) {
        var convertedItems = new _core2.default.storageProviders.oData.RequestManager();
        for (var index = 0; index < independentBlocks.length; index++) {
            for (var i = 0; i < independentBlocks[index].length; i++) {
                var independentItem = independentBlocks[index][i];

                var request = null;
                var item = convertedItems.getItem(independentItem.data);
                if (!item) {
                    request = new activities.RequestBuilder(this);
                    request.add(new activities.SetUrl(this.providerConfiguration.oDataServiceHost + '/'));
                    item = convertedItems.add(independentItem, request);
                }
                request = item.request;

                var entityState = independentItem.data.entityState;
                if (typeof this._buildRequestObject['EntityState_' + entityState] === 'function') {
                    if (!this._buildRequestObject['EntityState_' + entityState](this, independentItem, convertedItems, request, changedItems)) {
                        convertedItems.remove(independentItem.data);
                    }
                } else {
                    _core.Guard.raise(new _core.Exception("Not supported Entity state"));
                }
            }
        }

        return convertedItems;
    },
    _buildRequestObject: {
        value: {
            'EntityState_20': function EntityState_20(provider, item, convertedItem, request, changedItems) {
                request.add(new activities.SetMethod("POST"), new activities.AppendUrl(item.data["@odata.context"] || item.entitySet.tableName));
                if (item.data["@odata.type"]) request.add(new activities.SetDataProperty("@odata.type", item.data["@odata.type"]));
                provider.save_getInitData(item, convertedItem, undefined, undefined, request, changedItems);
                return request;
            },
            'EntityState_30': function EntityState_30(provider, item, convertedItem, request, changedItems) {
                var keysValue = provider.getEntityKeysValue(item);
                if (keysValue) {
                    request.add(new activities.SetMethod(provider.providerConfiguration.UpdateMethod), new activities.AppendUrl(item.data["@odata.context"] || item.entitySet.tableName));
                    request.add(new activities.AppendUrl("(" + keysValue + ")"));
                    if (item.data["@odata.type"]) request.add(new activities.SetDataProperty("@odata.type", item.data["@odata.type"]));
                    provider.addETagHeader(item, request);
                    provider.save_getInitData(item, convertedItem, undefined, undefined, request, changedItems);
                    return request;
                }
            },
            'EntityState_40': function EntityState_40(provider, item, convertedItem, request, changedItems) {
                var keysValue = provider.getEntityKeysValue(item);
                if (keysValue) {
                    request.add(new activities.SetMethod("DELETE"), new activities.ClearRequestData(), new activities.AppendUrl(item.data["@odata.context"] || item.entitySet.tableName));
                    request.add(new activities.AppendUrl("(" + keysValue + ")"));
                    provider.addETagHeader(item, request);
                    return request;
                }
            }
        }
    },
    reload_fromResponse: function reload_fromResponse(item, data, response) {
        var that = this;
        item.getType().memberDefinitions.getPublicMappedProperties().forEach(function (memDef) {
            var propType = _core.Container.resolveType(memDef.type);
            if (memDef.computed || memDef.key || !memDef.inverseProperty) {
                if (memDef.concurrencyMode === _core2.default.ConcurrencyMode.Fixed) {
                    //unescape?
                    //item[memDef.name] = response.headers.ETag || response.headers.Etag || response.headers.etag;
                    item[memDef.name] = data['@odata.etag'];
                } else if (memDef.isAssignableTo) {
                    if (data[memDef.name]) {
                        item[memDef.name] = new propType(data[memDef.name], { converters: that.fieldConverter.fromDb });
                    } else {
                        item[memDef.name] = data[memDef.name];
                    }
                } else if (propType === _core2.default.Array && memDef.elementType) {
                    var aeType = _core.Container.resolveType(memDef.elementType);
                    if (data[memDef.name] && Array.isArray(data[memDef.name])) {
                        var arrayProperty = [];
                        for (var ap = 0; ap < data[memDef.name].length; ap++) {
                            var aitem = data[memDef.name][ap];
                            if (aeType.isAssignableTo && !_core.Guard.isNullOrUndefined(aitem)) {
                                arrayProperty.push(new aeType(aitem, { converters: that.fieldConverter.fromDb }));
                            } else {
                                var etypeName = _core.Container.resolveName(aeType);
                                var econverter = that.fieldConverter.fromDb[etypeName];

                                arrayProperty.push(econverter ? econverter(aitem) : aitem);
                            }
                        }
                        item[memDef.name] = arrayProperty;
                    } else if (!data[memDef.name]) {
                        item[memDef.name] = data[memDef.name];
                    }
                } else {
                    var typeName = _core.Container.resolveName(memDef.type);
                    var converter = that.fieldConverter.fromDb[typeName];

                    item[memDef.name] = converter ? converter(data[memDef.name]) : data[memDef.name];
                }
            }
        }, this);
    },

    save_getInitData: function save_getInitData(item, convertedItems, isComplex, isDeep, request, changedItems) {
        var self = this;
        if (!isComplex) {
            item.physicalData = this.context._storageModel.getStorageModel(item.data.getType()).PhysicalType.convertTo(item.data, convertedItems);
        } else {
            item.physicalData = item.data;
        }
        var hasSavedProperty = item.data.entityState === _core2.default.EntityState.Added;
        item.physicalData.getType().memberDefinitions.asArray().forEach(function (memdef) {
            hasSavedProperty = self.propertyConversationSelector(item, memdef, convertedItems, request, changedItems, isDeep) || hasSavedProperty;
        }, this);

        if (!hasSavedProperty && !isDeep) {
            convertedItems.remove(item.data);
        }
    },
    propertyConversationSelector: function propertyConversationSelector(item, memdef, convertedItems, request, changedItems, isDeep) {
        if (memdef.kind == _core2.default.MemberTypes.complexProperty) {
            return this._complexPropertySelector.apply(this, arguments);
        }

        if (memdef.kind == _core2.default.MemberTypes.property) {
            return this._propertySelector.apply(this, arguments);
        }

        if (memdef.kind == _core2.default.MemberTypes.navProperty) {
            return this._navigationPropertySelector.apply(this, arguments);
        }

        return false;
    },
    _complexPropertySelector: function _complexPropertySelector(item, memdef, convertedItems, request, changedItems, isDeep) {
        return this.propertyConversationStrategies["complex"].apply(this, arguments);
    },
    _propertySelector: function _propertySelector(item, memdef, convertedItems, request, changedItems, isDeep) {
        if (typeof memdef.concurrencyMode === 'undefined') {
            switch (true) {
                case memdef.notMapped:
                    return false;
                case memdef.key === true:
                    this.propertyConversationStrategies["default"].apply(this, arguments);
                    return false;
                case isDeep:
                case item.data.entityState === _core2.default.EntityState.Added:
                case this._propertyIsChanged(item.data, memdef):
                    return this.propertyConversationStrategies["default"].apply(this, arguments);
                case !this._propertyIsChanged(item.data, memdef) && _checkODataMode(this, 'sendAllPropertiesOnChange'):
                    this.propertyConversationStrategies["default"].apply(this, arguments);
                    return false;
                default:
                    return false;
            }
        }

        return false;
    },
    _navigationPropertySelector: function _navigationPropertySelector(item, memdef, convertedItems, request, changedItems, isDeep) {
        var _this = this;

        if (isDeep || item.data.entityState === _core2.default.EntityState.Added || this._propertyIsChanged(item.data, memdef)) {

            var navigationValue = item.data[memdef.name];
            if (_checkODataMode(this, 'enableDeepSave') && navigationValue && item.data.entityState === _core2.default.EntityState.Added) {
                var result = null;
                if (Array.isArray(navigationValue)) {
                    navigationValue.forEach(function (navItem, index) {
                        _this._processDeepSaveItems(item, memdef, convertedItems, request, changedItems, navItem, "deepSaveArray", index);
                        //update not supported here
                    });
                    return true; //item.data is new
                } else {
                    result = this._processDeepSaveItems(item, memdef, convertedItems, request, changedItems, navigationValue, "deepSave");
                }

                if (result !== null) {
                    return result;
                }
            }

            return this._simpleNavigationPropertySelector.apply(this, arguments);
        }
        return false;
    },
    _simpleNavigationPropertySelector: function _simpleNavigationPropertySelector(item, memdef, convertedItems, request, changedItems, isDeep) {
        if (_checkODataMode(this, 'withReferenceMethods')) {
            return this.propertyConversationStrategies["withReferenceMethods"].apply(this, arguments);
        }

        return this.propertyConversationStrategies["navigation"].apply(this, arguments);
    },

    _processDeepSaveItems: function _processDeepSaveItems(item, memdef, convertedItems, request, changedItems, navigationEntity, strategy, index) {
        var referencedItems = changedItems.filter(function (it) {
            return it.data == navigationEntity;
        });

        if (referencedItems.length === 1 && referencedItems[0].enableDeepSave && navigationEntity.entityState === _core2.default.EntityState.Added && referencedItems[0].deepParent === item.data) {
            var deepItem = convertedItems.getItem(referencedItems[0].data);
            if (!deepItem) {
                var referencedRequest = new activities.RequestBuilder(this);
                referencedRequest.add(new activities.SetUrl(this.providerConfiguration.oDataServiceHost + '/'));
                deepItem = convertedItems.add(referencedItems[0], referencedRequest);
            }

            convertedItems.addItemReference(item.data, deepItem);
            if (!deepItem.removed) {
                convertedItems.remove(referencedItems[0].data);
            }

            return this.propertyConversationStrategies[strategy].call(this, item, memdef, convertedItems, request, changedItems, index);
        }

        return null;
    },
    _propertyIsChanged: function _propertyIsChanged(entity, memdef) {
        return entity && entity.changedProperties && entity.changedProperties.some(function (def) {
            return def.name === memdef.name;
        });
    },
    propertyConversationStrategies: {
        value: {
            "default": function _default(item, memdef, convertedItems, request, changedItems) {
                var typeName = _core.Container.resolveName(memdef.type);
                if (memdef.elementType) {
                    var elementType = _core.Container.resolveType(memdef.elementType);
                    if (elementType.isAssignableTo && elementType.isAssignableTo(_core2.default.Entity) && Array.isArray(item.physicalData[memdef.name])) {
                        item.physicalData[memdef.name].forEach(function (complexElement) {
                            var innerRequest = new activities.RequestBuilder(this);
                            this.save_getInitData({ data: complexElement }, convertedItems, true, true, innerRequest);
                            request.add(function (req) {
                                req.data = req.data || {};
                                req.data[memdef.name] = req.data[memdef.name] || [];
                                req.data[memdef.name].push(innerRequest.build().get().data);
                            });
                        }, this);
                        return true;
                    }
                }
                var converter = this.fieldConverter.toDb[typeName];
                request.add(new activities.SetProperty(memdef.name, converter ? converter(item.physicalData[memdef.name], memdef) : item.physicalData[memdef.name]));
                return true;
            },
            "withReferenceMethods": function withReferenceMethods(item, memdef, convertedItems, request, changedItems) {
                var reqItem = convertedItems.getItem(item.data);
                if (reqItem && reqItem.removed) return false; //deep saved

                var additionalRequest = new activities.RequestBuilder(this);
                var value = item.physicalData[memdef.name];
                if (value) {
                    additionalRequest.add(new activities.SetMethod('POST'));
                    if (value.__metadata) {
                        additionalRequest.add(new activities.SetProperty('@odata.id', this.providerConfiguration.oDataServiceHost + '/' + value.__metadata.uri));
                    } else if (value.__convertedRefence) {
                        additionalRequest.add(function (req, provider) {
                            var targetItem = value.__convertedRefence;
                            req.data = req.data || {};
                            if (targetItem.isProcessed) {
                                req.data["@odata.id"] = provider.getEntityUrlReference(targetItem.entity);
                            } else {
                                req.data["@odata.id"] = provider.providerConfiguration.oDataServiceHost + '/$' + targetItem.itemIndex;
                            }
                        });
                    }
                } else {
                    if (item.data.entityState === _core2.default.EntityState.Added || value !== null) return;

                    additionalRequest.add(new activities.SetUrl(this.providerConfiguration.oDataServiceHost + '/'), new activities.AppendUrl(item.entitySet.tableName), new activities.AppendUrl("(" + this.getEntityKeysValue(item) + ")"), new activities.SetMethod('DELETE'), new activities.ClearRequestData());
                }

                additionalRequest.add(function (req, provider) {
                    if (reqItem.isProcessed || item.data.entityState !== _core2.default.EntityState.Added) {
                        req.requestUri = provider.providerConfiguration.oDataServiceHost + '/';
                        req.requestUri += item.entitySet.tableName;
                        req.requestUri += "(" + provider.getEntityKeysValue(item) + ")";
                        provider.addETagHeader(item, req);
                    } else {
                        req.requestUri = '$' + reqItem.itemIndex;
                        provider.addETagHeader(item, req, _core2.default.defaults.OData.eTagAny);
                    }

                    req.requestUri += '/' + memdef.name + '/$ref';
                });

                var refItem = convertedItems.add(item, additionalRequest, false);
                convertedItems.addItemReference(item.data, refItem);
                return false;
            },
            "deepSave": function deepSave(item, memdef, convertedItems, request, changedItems) {
                var refItem = convertedItems.getItem(item.data[memdef.name]);
                request.add(function (req, provider) {
                    req.data[memdef.name] = refItem.request.build().get().data;
                });
                return true;
            },
            "deepSaveArray": function deepSaveArray(item, memdef, convertedItems, request, changedItems, index) {
                var refItem = convertedItems.getItem(item.data[memdef.name][index]);
                request.add(function (req, provider) {
                    req.data[memdef.name] = req.data[memdef.name] || [];
                    req.data[memdef.name].push(refItem.request.build().get().data);
                });
                return true;
            },
            "navigation": function navigation(item, memdef, convertedItems, request, changedItems) {

                request.add(function (req, provider) {
                    req.data = req.data || {};

                    if (item.physicalData[memdef.name] && item.physicalData[memdef.name].__metadata) {
                        req.data[memdef.name + "@odata.bind"] = item.physicalData[memdef.name].__metadata.uri;
                    } else if (item.physicalData[memdef.name] && item.physicalData[memdef.name].__convertedRefence) {
                        var targetItem = item.physicalData[memdef.name].__convertedRefence;
                        if (targetItem.isProcessed) {
                            req.data[memdef.name + "@odata.bind"] = provider.getEntityUrlReference(targetItem.entity);
                        } else {
                            req.data[memdef.name + "@odata.bind"] = "$" + targetItem.itemIndex;
                        }
                    } else if (item.physicalData[memdef.name] === null) {
                        req.data[memdef.name + "@odata.bind"] = null;
                    }
                });
                return true;
            },
            "complex": function complex(item, memdef, convertedItems, request, changedItems) {
                if (item.physicalData[memdef.name]) {
                    var innerRequest = new activities.RequestBuilder(this);
                    this.save_getInitData({ data: item.physicalData[memdef.name] }, convertedItems, true, true, innerRequest);
                    request.add(function (req) {
                        req.data = req.data || {};
                        req.data[memdef.name] = innerRequest.build().get().data;
                    });
                    return true;
                }
                return false;
            }
        }
    },

    addETagHeader: function addETagHeader(item, request, value) {
        var property = item.data.getType().memberDefinitions.getPublicMappedProperties().filter(function (memDef) {
            return memDef.concurrencyMode === _core2.default.ConcurrencyMode.Fixed;
        });
        if (property && property[0]) {
            var headerValue = typeof value !== "undefined" ? value : item.data[property[0].name];
            if (typeof headerValue !== "undefined") {
                if (request instanceof activities.RequestBuilder) {
                    request.add(new activities.SetHeaderProperty('If-Match', headerValue));
                } else {
                    request.headers['If-Match'] = headerValue;
                }
            }
        }
    },

    getTraceString: function getTraceString(queryable) {
        var sqlText = this._compile(queryable);
        return queryable;
    },
    supportedDataTypes: {
        value: [_core2.default.Array, _core2.default.Integer, _core2.default.String, _core2.default.Number, _core2.default.Blob, _core2.default.Boolean, _core2.default.Date, _core2.default.Object, _core2.default.GeographyPoint, _core2.default.Guid, _core2.default.GeographyLineString, _core2.default.GeographyPolygon, _core2.default.GeographyMultiPoint, _core2.default.GeographyMultiLineString, _core2.default.GeographyMultiPolygon, _core2.default.GeographyCollection, _core2.default.GeometryPoint, _core2.default.GeometryLineString, _core2.default.GeometryPolygon, _core2.default.GeometryMultiPoint, _core2.default.GeometryMultiLineString, _core2.default.GeometryMultiPolygon, _core2.default.GeometryCollection, _core2.default.Byte, _core2.default.SByte, _core2.default.Decimal, _core2.default.Float, _core2.default.Int16, _core2.default.Int32, _core2.default.Int64, _core2.default.Time, _core2.default.Day, _core2.default.DateTimeOffset, _core2.default.Duration],
        writable: false
    },

    supportedBinaryOperators: {
        value: {
            equal: { mapTo: 'eq', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },
            notEqual: { mapTo: 'ne', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },
            equalTyped: { mapTo: 'eq', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },
            notEqualTyped: { mapTo: 'ne', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },
            greaterThan: { mapTo: 'gt', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },
            greaterThanOrEqual: { mapTo: 'ge', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },

            lessThan: { mapTo: 'lt', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },
            lessThenOrEqual: { mapTo: 'le', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },
            or: { mapTo: 'or', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },
            and: { mapTo: 'and', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },

            add: { mapTo: 'add', dataType: "number", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },
            divide: { mapTo: 'div', allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },
            multiply: { mapTo: 'mul', allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },
            subtract: { mapTo: 'sub', allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },
            modulo: { mapTo: 'mod', allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] },

            "in": { mapTo: "in", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression] }
        }
    },

    supportedUnaryOperators: {
        value: {
            not: { mapTo: 'not' }
        }
    },

    supportedFieldOperations: {
        value: {
            /* string functions */

            contains: {
                mapTo: "contains",
                dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression" }, { name: "substring", dataType: "string" }]
            },

            startsWith: {
                mapTo: "startswith",
                dataType: "string", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: "string" }, { name: "strFragment", dataType: "string" }]
            },

            endsWith: {
                mapTo: "endswith",
                dataType: "string", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: "string" }, { name: "strFragment", dataType: "string" }]
            },

            length: [{
                allowedType: 'string',
                projection: function projection(v) {
                    return v ? v.length : 0;
                },
                dataType: "number", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.ProjectionExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: "string" }]
            }, {
                allowedType: 'GeographyLineString',
                mapTo: "geo.length",
                dataType: "number", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: ['GeographyLineString'] }],
                fixedDataType: 'decimal'
            }, {
                allowedType: 'GeometryLineString',
                mapTo: "geo.length",
                dataType: "number", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: 'GeometryLineString' }],
                fixedDataType: 'decimal'
            }],

            strLength: {
                mapTo: "length",
                projection: function projection(v) {
                    return v ? v.length : 0;
                },
                dataType: "number", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.ProjectionExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: "string" }]
            },

            indexOf: {
                dataType: "number", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                mapTo: "indexof",
                baseIndex: 1,
                parameters: [{ name: '@expression', dataType: "string" }, { name: 'strFragment', dataType: 'string' }]
            },

            replace: {
                dataType: "string", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: '@expression', dataType: "string" }, { name: 'strFrom', dataType: 'string' }, { name: 'strTo', dataType: 'string' }]
            },

            substr: {
                mapTo: "substring",
                dataType: "string", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: "string" }, { name: "startFrom", dataType: "number" }, { name: "length", dataType: "number", optional: "true" }]
            },

            toLowerCase: {
                mapTo: "tolower",
                dataType: "string", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: "string" }]
            },

            toUpperCase: {
                mapTo: "toupper",
                dataType: "string", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: "string" }]

            },

            trim: {
                dataType: "string", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: "string" }]
            },

            concat: {
                dataType: "string", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: "string" }, { name: "strFragment", dataType: "string" }]
            },

            /* data functions */

            day: {
                allowedIn: [_core2.default.Expressions.ProjectionExpression, _core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                dataType: "number",
                projection: function projection(v) {
                    return new Date(v).getUTCDate();
                },
                parameters: [{ name: "@expression", dataType: "date" }]
            },
            hour: {
                allowedIn: [_core2.default.Expressions.ProjectionExpression, _core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                dataType: "number",
                projection: function projection(v) {
                    return new Date(v).getUTCHours();
                },
                parameters: [{ name: "@expression", dataType: "date" }]
            },
            minute: {
                allowedIn: [_core2.default.Expressions.ProjectionExpression, _core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                dataType: "number",
                projection: function projection(v) {
                    return new Date(v).getUTCMinutes();
                },
                parameters: [{ name: "@expression", dataType: "date" }]
            },
            month: {
                allowedIn: [_core2.default.Expressions.ProjectionExpression, _core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                dataType: "number",
                projection: function projection(v) {
                    return new Date(v).getUTCMonth() + 1;
                },
                parameters: [{ name: "@expression", dataType: "date" }]
            },
            second: {
                allowedIn: [_core2.default.Expressions.ProjectionExpression, _core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                dataType: "number",
                projection: function projection(v) {
                    return new Date(v).getUTCSeconds();
                },
                parameters: [{ name: "@expression", dataType: "date" }]
            },
            year: {
                allowedIn: [_core2.default.Expressions.ProjectionExpression, _core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                dataType: "number",
                projection: function projection(v) {
                    return new Date(v).getFullYear();
                },
                parameters: [{ name: "@expression", dataType: "date" }]
            },
            fractionalseconds: {
                allowedIn: [_core2.default.Expressions.ProjectionExpression, _core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                dataType: "number",
                projection: function projection(v) {
                    return new Date(v).getUTCMilliseconds() / 1000;
                },
                parameters: [{ name: "@expression", dataType: "date" }]
            },

            /* number functions */
            round: {
                allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: "date" }]
            },
            floor: {
                allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: "date" }]
            },
            ceiling: {
                allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: "date" }]
            },

            /* geo functions */
            distance: [{
                allowedType: 'GeographyPoint',
                mapTo: "geo.distance",
                dataType: "number", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: 'GeographyPoint' }, { name: "to", dataType: 'GeographyPoint' }],
                fixedDataType: 'decimal'
            }, {
                allowedType: 'GeometryPoint',
                mapTo: "geo.distance",
                dataType: "number", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: 'GeometryPoint' }, { name: "to", dataType: 'GeometryPoint' }],
                fixedDataType: 'decimal'
            }],

            intersects: [{
                allowedType: 'GeographyPoint',
                mapTo: "geo.intersects",
                dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: 'GeographyPoint' }, { name: "in", dataType: 'GeographyPolygon' }]

            }, {
                allowedType: 'GeometryPoint',
                mapTo: "geo.intersects",
                dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression, _core2.default.Expressions.OrderExpression, _core2.default.Expressions.SomeExpression, _core2.default.Expressions.EveryExpression],
                parameters: [{ name: "@expression", dataType: 'GeometryPoint' }, { name: "in", dataType: 'GeometryPolygon' }]

            }],

            // aggregate functions
            'sum': {
                allowedIn: [_core2.default.Expressions.ProjectionExpression],
                mapTo: 'sum',
                aggregate: true
            },
            'count': {
                allowedIn: [_core2.default.Expressions.ProjectionExpression],
                mapTo: 'countdistinct',
                returnType: _core2.default.Integer,
                aggregate: true
            },
            'min': {
                allowedIn: [_core2.default.Expressions.ProjectionExpression],
                mapTo: 'min',
                aggregate: true
            },
            'max': {
                allowedIn: [_core2.default.Expressions.ProjectionExpression],
                mapTo: 'max',
                aggregate: true
            },
            'avg': {
                allowedIn: [_core2.default.Expressions.ProjectionExpression],
                mapTo: 'average',
                aggregate: true
            }
        },
        enumerable: true,
        writable: true
    },
    supportedSetOperations: {
        value: {
            filter: {
                allowedIn: [_core2.default.Expressions.IncludeExpression],
                parameters: [{ name: "filter", dataType: "$data.Queryable" }],
                frameType: _core2.default.Expressions.FilterExpression,
                includeFrameName: '$filter',
                includeCompiler: '$data.storageProviders.oData.oDataWhereCompiler'
            },
            map: {
                allowedIn: [_core2.default.Expressions.IncludeExpression],
                parameters: [{ name: "map", dataType: "$data.Queryable" }],
                frameType: _core2.default.Expressions.ProjectionExpression,
                includeFrameName: '$select',
                includeCompiler: '$data.storageProviders.oData.oDataProjectionCompiler'
            },
            length: {},
            forEach: {},
            toArray: {},
            single: {},
            some: {
                invokable: false,
                allowedIn: [_core2.default.Expressions.FilterExpression],
                parameters: [{ name: "some", dataType: "$data.Queryable" }],
                mapTo: 'any',
                frameType: _core2.default.Expressions.SomeExpression
            },
            every: {
                invokable: false,
                allowedIn: [_core2.default.Expressions.FilterExpression],
                parameters: [{ name: "every", dataType: "$data.Queryable" }],
                mapTo: 'all',
                frameType: _core2.default.Expressions.EveryExpression
            },
            take: {
                allowedIn: [_core2.default.Expressions.IncludeExpression],
                parameters: [{ name: "take", dataType: "$data.Integer" }],
                frameType: _core2.default.Expressions.PagingExpression,
                includeFrameName: '$top',
                includeCompiler: '$data.storageProviders.oData.oDataPagingCompiler'
            },
            skip: {
                allowedIn: [_core2.default.Expressions.IncludeExpression],
                parameters: [{ name: "skip", dataType: "$data.Integer" }],
                frameType: _core2.default.Expressions.PagingExpression,
                includeFrameName: '$skip',
                includeCompiler: '$data.storageProviders.oData.oDataPagingCompiler'
            },
            orderBy: {
                allowedIn: [_core2.default.Expressions.IncludeExpression],
                parameters: [{ name: "orderBy", dataType: "$data.Queryable" }],
                frameType: _core2.default.Expressions.OrderExpression,
                includeFrameName: '$orderby',
                includeCompiler: '$data.storageProviders.oData.oDataOrderCompiler'
            },
            orderByDescending: {
                allowedIn: [_core2.default.Expressions.IncludeExpression],
                parameters: [{ name: "orderByDescending", dataType: "$data.Queryable" }],
                frameType: _core2.default.Expressions.OrderExpression,
                frameTypeFactory: function frameTypeFactory(source, selector) {
                    return new _core2.default.Expressions.OrderExpression(source, selector, _core2.default.Expressions.ExpressionType.OrderByDescending);
                },
                includeFrameName: '$orderby',
                includeCompiler: '$data.storageProviders.oData.oDataOrderCompiler'
            },
            first: {},
            include: {},
            batchDelete: {},
            withInlineCount: {
                allowedIn: [_core2.default.Expressions.IncludeExpression],
                parameters: [],
                frameType: _core2.default.Expressions.InlineCountExpression,
                includeFrameName: '$count',
                implementation: function implementation() {
                    return 'true';
                }
            },
            find: {},
            distinct: {},
            groupBy: {}
        },
        enumerable: true,
        writable: true
    },
    supportedContextOperation: {
        value: {
            batchExecuteQuery: true
        },
        enumerable: true,
        writable: true
    },

    fieldConverter: { value: _core2.default.oDataConverter },
    resolveTypeOperations: function resolveTypeOperations(operation, expression, frameType) {
        var memDef = expression.entityType.getMemberDefinition(operation);
        if (!memDef || !memDef.method || memDef.method.IsSideEffecting !== false || !memDef.method.returnType || !(frameType === _core2.default.Expressions.FilterExpression || frameType === _core2.default.Expressions.OrderExpression)) {
            _core.Guard.raise(new _core.Exception("Entity '" + expression.entityType.name + "' Operation '" + operation + "' is not supported by the provider"));
        }

        return memDef;
    },
    resolveSetOperations: function resolveSetOperations(operation, expression, frameType) {
        if (expression) {
            var esDef = expression.storageModel.ContextType.getMemberDefinition(expression.storageModel.ItemName);
            if (esDef && esDef.actions && esDef.actions[operation]) {
                var memDef = _core2.default.MemberDefinition.translateDefinition(esDef.actions[operation], operation, this.getType());
                if (!memDef || !memDef.method || memDef.method.IsSideEffecting !== false || !memDef.method.returnType || !(frameType === _core2.default.Expressions.FilterExpression || frameType === _core2.default.Expressions.OrderExpression)) {

                    _core.Guard.raise(new _core.Exception("Collection '" + expression.storageModel.ItemName + "' Operation '" + operation + "' is not supported by the provider"));
                }

                return memDef;
            }
        }
        return _core2.default.StorageProviderBase.prototype.resolveSetOperations.apply(this, arguments);
    },
    resolveContextOperations: function resolveContextOperations(operation, expression, frameType) {
        var memDef = this.context.getType().getMemberDefinition(operation);
        if (!memDef || !memDef.method || memDef.method.IsSideEffecting !== false || !memDef.method.returnType || !(frameType === _core2.default.Expressions.FilterExpression || frameType === _core2.default.Expressions.OrderExpression)) {
            _core.Guard.raise(new _core.Exception("Context '" + expression.instance.getType().name + "' Operation '" + operation + "' is not supported by the provider"));
        }
        return memDef;
    },

    getEntityUrlReference: function getEntityUrlReference(entity) {
        var sMod = this.context._storageModel.getStorageModel(entity.getType());
        var tblName = sMod.TableName;
        var pk = '(' + this.getEntityKeysValue({ data: entity, entitySet: this.context.getEntitySetFromElementType(entity.getType()) }) + ')';
        return this.providerConfiguration.oDataServiceHost + '/' + tblName + pk;
    },

    getEntityKeysValue: function getEntityKeysValue(entity) {
        var result = [];
        var keyValue = undefined;
        var memDefs = entity.data.getType().memberDefinitions.getKeyProperties();
        for (var i = 0, l = memDefs.length; i < l; i++) {
            var field = memDefs[i];
            if (field.key) {
                keyValue = entity.data[field.name];
                if (_core.Guard.isNullOrUndefined(keyValue)) continue;

                var typeName = _core.Container.resolveName(field.type);

                var converter = this.fieldConverter.toDb[typeName];
                keyValue = converter ? converter(keyValue) : keyValue;

                converter = this.fieldConverter.escape[typeName];
                keyValue = converter ? converter(keyValue) : keyValue;

                result.push(field.name + "=" + keyValue);
            }
        }
        if (result.length > 1) {
            return result.join(",");
        }
        return keyValue;
    },
    getFieldUrl: function getFieldUrl(entity, fieldName, entitySet) {
        var keyPart = this.getEntityKeysValue({ data: entity });
        var servicehost = this.providerConfiguration.oDataServiceHost;
        if (servicehost.lastIndexOf('/') === servicehost.length) servicehost = servicehost.substring(0, servicehost.length - 1);

        return servicehost + '/' + entitySet.tableName + '(' + keyPart + ')/' + fieldName + '/$value';
    }, /*
       getServiceMetadata: function () {
         $data.ajax(this._setAjaxAuthHeader({
             url: this.providerConfiguration.oDataServiceHost + "/$metadata",
             dataType: "xml",
             success: function (d) {
                 console.log("OK");
                 console.dir(d);
                 console.log(typeof d);
                 window["s"] = d;
                 window["k"] = this.nsResolver;
                 //s.evaluate("edmx:Edmx/edmx:DataServices/Schema", s, $data.storageProviders.oData.oDataProvider.prototype.nsResolver, XPathResult.ANY_TYPE, null).iterateNext()
               },
             error: function (error) {
                 console.log("error:");
                 console.dir(error);
             }
         }));
       },
       nsResolver: function (sPrefix) {
         switch (sPrefix) {
             case "edmx":
                 return "http://schemas.microsoft.com/ado/2007/06/edmx";
                 break;
             case "m":
                 return "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";
                 break;
             case "d":
                 return "http://schemas.microsoft.com/ado/2007/08/dataservices";
                 break;
             default:
                 return "http://schemas.microsoft.com/ado/2008/09/edm";
                 break;
         }
       }
       */
    parseError: function parseError(error, data) {

        var message = (error.response || error || {}).body || '';
        try {
            if (message.indexOf('{') === 0) {
                var errorObj = JSON.parse(message);
                errorObj = errorObj['odata.error'] || errorObj.error || errorObj;
                if (errorObj.message) {
                    message = errorObj.message.value || errorObj.message;
                }
            }
        } catch (e) {}

        return new _core.Exception(message, error.message, data || error);
    },
    appendBasicAuth: function appendBasicAuth(request, user, password, withCredentials) {
        request.headers = request.headers || {};
        if (!request.headers.Authorization && user && password) {
            request.headers.Authorization = "Basic " + this.__encodeBase64(user + ":" + password);
        }
        if (withCredentials) {
            request.withCredentials = withCredentials;
        }
    },
    __encodeBase64: function __encodeBase64(val) {
        var b64array = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789+/" + "=";

        var input = val;
        var base64 = "";
        var hex = "";
        var chr1,
            chr2,
            chr3 = "";
        var enc1,
            enc2,
            enc3,
            enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = (chr1 & 3) << 4 | chr2 >> 4;
            enc3 = (chr2 & 15) << 2 | chr3 >> 6;
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            base64 = base64 + b64array.charAt(enc1) + b64array.charAt(enc2) + b64array.charAt(enc3) + b64array.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return base64;
    },
    checkODataMode: function checkODataMode(functionName) {
        return _checkODataMode(this, functionName);
    }
}, null);

_core2.default.StorageProviderBase.registerProvider("oData", _core2.default.storageProviders.oData.oDataProvider);