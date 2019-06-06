'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define('$data.ItemStoreClass', null, null, {
    constructor: function constructor() {
        var self = this;
        self.itemStoreConfig = {
            aliases: {},
            contextTypes: {}
        };

        self.resetStoreToDefault('local', true);
        _index2.default.addStore = function () {
            return self.addItemStoreAlias.apply(self, arguments);
        };
        _index2.default.implementation = self.implementation;

        _index2.default.Entity.addMember('storeToken', {
            get: function get() {
                if (this.storeConfigs && this.storeConfigs['default']) return this.storeConfigs.stores[this.storeConfigs['default']];
            },
            set: function set(value) {
                self._setTypeStoreConfig(this, 'default', value);
            }
        }, true);
    },
    itemStoreConfig: {},
    attachMode: _index2.default.EntityAttachMode ? _index2.default.EntityAttachMode.KeepChanges : true,

    addItemStoreAlias: function addItemStoreAlias(name, contextFactoryOrToken, isDefault) {
        var self = this;
        var promise = new _index2.default.PromiseHandler();
        var callback = promise.createCallback();

        if ('string' === typeof name) {
            //storeToken
            if ('object' === (typeof contextFactoryOrToken === 'undefined' ? 'undefined' : _typeof(contextFactoryOrToken)) && 'factory' in contextFactoryOrToken) {
                var type = _index.Container.resolveType(contextFactoryOrToken.typeName);

                self.itemStoreConfig.aliases[name] = contextFactoryOrToken.factory;
                self.itemStoreConfig.contextTypes[name] = type;
                if (isDefault) {
                    self.itemStoreConfig['default'] = name;
                }

                callback.success();
                return promise.getPromise();
            }
            //contextFactory
            else if ('function' === typeof contextFactoryOrToken) {
                    var preContext = contextFactoryOrToken();
                    var contextPromise;
                    if (preContext && preContext instanceof _index2.default.EntityContext) {
                        callback.success(preContext);
                        contextPromise = promise.getPromise();
                    } else {
                        contextPromise = preContext;
                    }

                    return contextPromise.then(function (ctx) {
                        if (typeof ctx === 'function') {
                            //factory resolve factory
                            return self.addItemStoreAlias(name, ctx, isDefault);
                        }

                        if (ctx instanceof _index2.default.EntityContext) {
                            return ctx.onReady().then(function (ctx) {
                                self.itemStoreConfig.aliases[name] = contextFactoryOrToken;
                                self.itemStoreConfig.contextTypes[name] = ctx.getType();
                                if (isDefault) {
                                    self.itemStoreConfig['default'] = name;
                                }

                                return ctx;
                            });
                        } else {
                            promise = new _index2.default.PromiseHandler();
                            callback = promise.createCallback();
                            callback.error(new _index.Exception('factory dont have context instance', 'Invalid arguments'));
                            return promise.getPromise();
                        }
                    });
                }
        }

        callback.error(new _index.Exception('Name or factory missing', 'Invalid arguments'));
        return promise.getPromise();
    },
    resetStoreToDefault: function resetStoreToDefault(name, isDefault) {
        this.itemStoreConfig.aliases[name] = this._getDefaultItemStoreFactory;
        delete this.itemStoreConfig.contextTypes[name];
        if (isDefault) {
            this.itemStoreConfig['default'] = name;
        }
    },
    _setStoreAlias: function _setStoreAlias(entity, storeToken) {
        if ('object' === (typeof storeToken === 'undefined' ? 'undefined' : _typeof(storeToken)) && !entity.storeToken) entity.storeToken = storeToken;
        return entity;
    },
    _getStoreAlias: function _getStoreAlias(entity, storeAlias) {
        var type;
        if (entity instanceof _index2.default.Entity) {
            var alias = storeAlias || entity.storeToken;
            if (alias) {
                return alias;
            } else {
                type = entity.getType();
            }
        } else {
            type = entity;
        }

        return storeAlias || (type.storeConfigs ? type.storeConfigs['default'] : undefined) || type.storeToken;
    },
    _getStoreContext: function _getStoreContext(aliasOrToken, type, nullIfInvalid) {
        var contextPromise = this._getContextPromise(aliasOrToken, type);

        if (!contextPromise || contextPromise instanceof _index2.default.EntityContext) {
            var promise = new _index2.default.PromiseHandler();
            var callback = promise.createCallback();
            callback.success(contextPromise);
            contextPromise = promise.getPromise();
        }

        return contextPromise.then(function (context) {
            if (context instanceof _index2.default.EntityContext) {
                return context.onReady();
            } else if (nullIfInvalid) {
                return null;
            } else {
                var promise = new _index2.default.PromiseHandler();
                var callback = promise.createCallback();
                callback.error(new _index.Exception('factory return type error', 'Error'));
                return promise.getPromise();
            }
        });
    },
    _getContextPromise: function _getContextPromise(aliasOrToken, type) {
        /*Token*/
        if (aliasOrToken && 'object' === (typeof aliasOrToken === 'undefined' ? 'undefined' : _typeof(aliasOrToken)) && 'function' === typeof aliasOrToken.factory) {
            return aliasOrToken.factory(type);
        } else if (aliasOrToken && 'object' === (typeof aliasOrToken === 'undefined' ? 'undefined' : _typeof(aliasOrToken)) && 'object' === _typeof(aliasOrToken.args) && 'string' === typeof aliasOrToken.typeName) {
            var type = _index.Container.resolveType(aliasOrToken.typeName);
            return new type(JSON.parse(JSON.stringify(aliasOrToken.args)));
        }
        /*resolve alias from type (Token)*/
        else if (aliasOrToken && 'string' === typeof aliasOrToken && type.storeConfigs && type.storeConfigs.stores[aliasOrToken] && typeof type.storeConfigs.stores[aliasOrToken].factory === 'function') {
                return type.storeConfigs.stores[aliasOrToken].factory();
            }
            /*resolve alias from type (constructor options)*/
            else if (aliasOrToken && 'string' === typeof aliasOrToken && type.storeConfigs && type.storeConfigs.stores[aliasOrToken]) {
                    return this._getDefaultItemStoreFactory(type, type.storeConfigs.stores[aliasOrToken]);
                }
                /*resolve alias from ItemStore (factories)*/
                else if (aliasOrToken && 'string' === typeof aliasOrToken && this.itemStoreConfig.aliases[aliasOrToken]) {
                        return this.itemStoreConfig.aliases[aliasOrToken](type);
                    }
                    /*token is factory*/
                    else if (aliasOrToken && 'function' === typeof aliasOrToken) {
                            return aliasOrToken();
                        }
                        /*default no hint*/
                        else {
                                return this.itemStoreConfig.aliases[this.itemStoreConfig['default']](type);
                            }
    },
    _getStoreEntitySet: function _getStoreEntitySet(storeAlias, instanceOrType) {
        var aliasOrToken = this._getStoreAlias(instanceOrType, storeAlias);
        var type = "function" === typeof instanceOrType ? instanceOrType : instanceOrType.getType();;

        return this._getStoreContext(aliasOrToken, type).then(function (ctx) {
            var entitySet = ctx.getEntitySetFromElementType(type);
            if (!entitySet) {
                var d = new _index2.default.PromiseHandler();
                var callback = d.createCallback();
                callback.error("EntitySet not exist for " + type.fullName);
                return d.getPromise();
            }
            return entitySet;
        });
    },
    _getDefaultItemStoreFactory: function _getDefaultItemStoreFactory(instanceOrType, initStoreConfig) {
        if (instanceOrType) {
            var type = "function" === typeof instanceOrType ? instanceOrType : instanceOrType.getType();
            var typeName = _index2.default.Container.resolveName(type) + "_items";
            var typeName = typeName.replace(/\./g, "_");

            var storeConfig = _index2.default.typeSystem.extend({
                collectionName: initStoreConfig && initStoreConfig.collectionName ? initStoreConfig.collectionName : 'Items',
                tableName: typeName,
                initParam: { provider: 'local', databaseName: typeName }
            }, initStoreConfig);

            var contextDef = {};
            contextDef[storeConfig.collectionName] = { type: _index2.default.EntitySet, elementType: type };
            if (storeConfig.tableName) contextDef[storeConfig.collectionName]['tableName'] = storeConfig.tableName;

            var inMemoryType = _index2.default.EntityContext.extend(typeName, contextDef);
            var ctx = new inMemoryType(storeConfig.initParam);
            if (initStoreConfig && (typeof initStoreConfig === 'undefined' ? 'undefined' : _typeof(initStoreConfig)) === 'object') initStoreConfig.factory = ctx._storeToken.factory;
            return ctx;
        }
        return undefined;
    },
    implementation: function implementation(name, contextOrAlias) {
        var self = _index2.default.ItemStore;
        var result;

        if (typeof contextOrAlias === 'string') {
            contextOrAlias = self.itemStoreConfig.contextTypes[contextOrAlias];
        } else if (contextOrAlias instanceof _index2.default.EntityContext) {
            contextOrAlias = contextOrAlias.getType();
        } else if (!(typeof contextOrAlias === 'function' && contextOrAlias.isAssignableTo)) {
            contextOrAlias = self.itemStoreConfig.contextTypes[self.itemStoreConfig['default']];
        }

        if (contextOrAlias) {
            result = self._resolveFromContext(contextOrAlias, name);
        }

        if (!result) {
            result = _index.Container.resolveType(name);
        }

        return result;
    },
    _resolveFromContext: function _resolveFromContext(contextType, name) {
        var memDefs = contextType.memberDefinitions.getPublicMappedProperties();
        for (var i = 0; i < memDefs.length; i++) {
            var memDef = memDefs[i];
            if (memDef.type) {
                var memDefType = _index.Container.resolveType(memDef.type);
                if (memDefType.isAssignableTo && memDefType.isAssignableTo(_index2.default.EntitySet)) {
                    var elementType = _index.Container.resolveType(memDef.elementType);
                    if (elementType.name === name) {
                        return elementType;
                    }
                }
            }
        }
        return null;
    },

    //Entity Instance
    EntityInstanceSave: function EntityInstanceSave(storeAlias, hint, attachMode) {
        var self = _index2.default.ItemStore;
        var entity = this;
        return self._getStoreEntitySet(storeAlias, entity).then(function (entitySet) {
            return self._getSaveMode(entity, entitySet, hint, storeAlias).then(function (mode) {
                mode = mode || 'add';
                switch (mode) {
                    case 'add':
                        entitySet.add(entity);
                        break;
                    case 'attach':
                        entitySet.attach(entity, attachMode || true);
                        break;
                    default:
                        var d = new _index2.default.PromiseHandler();
                        var callback = d.createCallback();
                        callback.error('save mode not supported: ' + mode);
                        return d.getPromise();
                }

                return entitySet.entityContext.saveChanges().then(function () {
                    self._setStoreAlias(entity, entitySet.entityContext.storeToken);return entity;
                });
            });
        });
    },
    EntityInstanceRemove: function EntityInstanceRemove(storeAlias) {
        var self = _index2.default.ItemStore;
        var entity = this;
        return self._getStoreEntitySet(storeAlias, entity).then(function (entitySet) {
            entitySet.remove(entity);

            return entitySet.entityContext.saveChanges().then(function () {
                return entity;
            });
        });
    },
    EntityInstanceRefresh: function EntityInstanceRefresh(storeAlias, keepStore) {
        var self = _index2.default.ItemStore;
        var entity = this;
        var entityType = entity.getType();

        var key = self._getKeyObjectFromEntity(entity, entityType);

        return entityType.read(key, storeAlias).then(function (loadedEntity) {
            entityType.memberDefinitions.getPublicMappedProperties().forEach(function (memDef) {
                entity[memDef.name] = loadedEntity[memDef.name];
            });
            entity.storeToken = (keepStore ? entity.storeToken : undefined) || loadedEntity.storeToken;
            entity.changedProperties = undefined;
            return entity;
        });
    },

    //Entity Type
    EntityInheritedTypeProcessor: function EntityInheritedTypeProcessor(type) {
        var self = _index2.default.ItemStore;
        type.readAll = self.EntityTypeReadAll(type);
        type.read = self.EntityTypeRead(type);
        type.removeAll = self.EntityTypeRemoveAll(type);
        type.remove = self.EntityTypeRemove(type);
        type.get = self.EntityTypeGet(type); //Not complete
        type.save = self.EntityTypeSave(type);
        type.addMany = self.EntityTypeAddMany(type);
        type.itemCount = self.EntityTypeItemCount(type);
        type.query = self.EntityTypeQuery(type);
        type.takeFirst = self.EntityTypeTakeFirst(type);

        type.setStore = self.EntityTypeSetStore(type);
    },
    EntityTypeReadAll: function EntityTypeReadAll(type) {
        return function (storeAlias) {
            var self = _index2.default.ItemStore;
            return self._getStoreEntitySet(storeAlias, type).then(function (entitySet) {
                return entitySet.forEach(function (item) {
                    self._setStoreAlias(item, entitySet.entityContext.storeToken);
                });
            });
        };
    },
    EntityTypeRemoveAll: function EntityTypeRemoveAll(type) {
        return function (storeAlias) {
            var self = _index2.default.ItemStore;
            return self._getStoreEntitySet(storeAlias, type).then(function (entitySet) {
                return entitySet.toArray().then(function (items) {
                    items.forEach(function (item) {
                        entitySet.remove(item);
                    });

                    return entitySet.entityContext.saveChanges().then(function () {
                        return items;
                    });
                });
            });
        };
    },
    EntityTypeRead: function EntityTypeRead(type) {
        return function (key, storeAlias) {
            var self = _index2.default.ItemStore;
            return self._getStoreEntitySet(storeAlias, type).then(function (entitySet) {
                try {
                    var singleParam = self._findByIdQueryable(entitySet, key);
                    return entitySet.single(singleParam.predicate, singleParam.thisArgs).then(function (item) {
                        return self._setStoreAlias(item, entitySet.entityContext.storeToken);
                    });
                } catch (e) {
                    var d = new _index2.default.PromiseHandler();
                    var callback = d.createCallback();
                    callback.error(e);
                    return d.getPromise();
                }
            });
        };
    },
    EntityTypeGet: function EntityTypeGet(type) {
        return function (key, storeAlias) {
            var self = _index2.default.ItemStore;
            var item = new type(self._getKeyObjectFromEntity(key));
            item.refresh(storeAlias);
            return item;
        };
    },
    EntityTypeSave: function EntityTypeSave(type) {
        return function (initData, storeAlias, hint) {

            var self = _index2.default.ItemStore;
            var instance = new type(initData);
            return instance.save(storeAlias, hint);
        };
    },
    EntityTypeAddMany: function EntityTypeAddMany(type) {
        return function (initDatas, storeAlias) {
            var self = _index2.default.ItemStore;
            return self._getStoreEntitySet(storeAlias, type).then(function (entitySet) {
                var items = entitySet.addMany(initDatas);
                return entitySet.entityContext.saveChanges().then(function () {
                    return items;
                });
            });
        };
    },
    EntityTypeRemove: function EntityTypeRemove(type) {
        return function (key, storeAlias) {
            var self = _index2.default.ItemStore;
            var entityPk = type.memberDefinitions.getKeyProperties();
            var entity;
            if (entityPk.length === 1) {
                var obj = {};
                obj[entityPk[0].name] = key;
                entity = new type(obj);
            } else {
                entity = new type(key);
            }
            return entity.remove(storeAlias);
        };
    },
    EntityTypeItemCount: function EntityTypeItemCount(type) {
        return function (storeAlias) {
            var self = _index2.default.ItemStore;
            return self._getStoreEntitySet(storeAlias, type).then(function (entitySet) {
                return entitySet.length();
            });
        };
    },
    EntityTypeQuery: function EntityTypeQuery(type) {
        return function (predicate, thisArg, storeAlias) {
            var self = _index2.default.ItemStore;
            return self._getStoreEntitySet(storeAlias, type).then(function (entitySet) {
                return entitySet.filter(predicate, thisArg).forEach(function (item) {
                    self._setStoreAlias(item, entitySet.entityContext.storeToken);
                });
            });
        };
    },
    EntityTypeTakeFirst: function EntityTypeTakeFirst(type) {
        return function (predicate, thisArg, storeAlias) {
            var self = _index2.default.ItemStore;
            return self._getStoreEntitySet(storeAlias, type).then(function (entitySet) {
                return entitySet.first(predicate, thisArg).then(function (item) {
                    return self._setStoreAlias(item, entitySet.entityContext.storeToken);
                });
            });
        };
    },

    EntityTypeSetStore: function EntityTypeSetStore(type) {
        return function (name, config) {
            if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' && typeof config === 'undefined') {
                config = name;
                name = 'default';
            }

            var self = _index2.default.ItemStore;

            var defStoreConfig = {};
            if (config) {
                if (config.tableName) {
                    defStoreConfig.tableName = config.tableName;
                    delete config.tableName;
                }

                if (config.collectionName) {
                    defStoreConfig.collectionName = config.collectionName;
                    delete config.collectionName;
                }

                if (typeof config.dataSource === 'string') {
                    var ds = config.dataSource;
                    if (ds.lastIndexOf('/') === ds.length - 1) {
                        ds = ds.substring(0, ds.lastIndexOf('/'));
                    }
                    var parsedApiUrl = ds.substring(0, ds.lastIndexOf('/'));
                    if (!defStoreConfig.tableName) defStoreConfig.tableName = ds.substring(ds.lastIndexOf('/') + 1);

                    var provider = config.provider || config.name;
                    switch (provider) {
                        case 'oData':
                            config.oDataServiceHost = config.oDataServiceHost || parsedApiUrl;
                            break;
                        case 'webApi':
                            config.apiUrl = config.apiUrl || parsedApiUrl;
                            break;
                        default:
                            break;
                    }
                }
            } else {
                config = { name: 'local' };
            }

            defStoreConfig.initParam = config;
            self._setTypeStoreConfig(type, name, defStoreConfig);

            return type;
        };
    },
    _setTypeStoreConfig: function _setTypeStoreConfig(type, name, config) {
        if (!type.storeConfigs) {
            type.storeConfigs = {
                stores: {}
            };
        }
        type.storeConfigs.stores[name] = config;
        if (name === 'default') {
            type.storeConfigs['default'] = name;
        }
    },

    _findByIdQueryable: function _findByIdQueryable(set, keys) {
        var keysProps = set.defaultType.memberDefinitions.getKeyProperties();
        if (keysProps.length > 1 && keys && 'object' === (typeof keys === 'undefined' ? 'undefined' : _typeof(keys))) {
            var predicate = "",
                thisArgs = {};
            for (var i = 0; i < keysProps.length; i++) {
                if (i > 0) predicate += " && ";

                var key = keysProps[i];
                predicate += "it." + key.name + " == this." + key.name;
                thisArgs[key.name] = keys[key.name];
            }

            return {
                predicate: predicate,
                thisArgs: thisArgs
            };
        } else if (keysProps.length === 1) {
            return {
                predicate: "it." + keysProps[0].name + " == this.value",
                thisArgs: { value: keys }
            };
        } else {
            throw 'invalid keys';
        }
    },
    _getKeyObjectFromEntity: function _getKeyObjectFromEntity(obj, entityType) {
        var key;
        var keyDefs = entityType.memberDefinitions.getKeyProperties();
        if (keyDefs.length === 1) key = obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' ? obj[keyDefs[0].name] : obj;else {
            key = {};

            for (var i = 0; i < keyDefs.length; i++) {
                key[keyDefs[0].name] = obj ? obj[keyDefs[0].name] : obj;
            }
        }

        return key;
    },
    _getSaveMode: function _getSaveMode(entity, entitySet, hint, storeAlias) {
        var self = this;
        var promise = new _index2.default.PromiseHandler();
        var callback = promise.createCallback();
        var entityType = entity.getType();

        switch (true) {
            case hint === 'update':
                callback.success('attach');break;
            case hint === 'new':
                callback.success('add');break;
            case false === entityType.memberDefinitions.getKeyProperties().every(function (keyDef) {
                return entity[keyDef.name];
            }):
                callback.success('add');break;
            case !!entity.storeToken:
                callback.success('attach');break;
                break;
            default:
                //use the current entity store informations
                storeAlias = this._getStoreAlias(entity, storeAlias);
                entityType.read(self._getKeyObjectFromEntity(entity, entityType), storeAlias).then(function () {
                    callback.success('attach');
                }, function () {
                    callback.success('add');
                });
                break;
        }

        return promise.getPromise();
    },

    //EntityContext
    ContextRegister: function ContextRegister(storageProviderCfg) {
        //context instance
        var self = this;
        if (typeof storageProviderCfg.name === "string") {
            storageProviderCfg.name = [storageProviderCfg.name];
        }

        var args = JSON.parse(JSON.stringify(storageProviderCfg));
        this.storeToken = {
            typeName: this.getType().fullName,
            args: args,
            factory: function factory() {
                return new (self.getType())(args);
            }

            //set elementType storetoken
        };var members = this.getType().memberDefinitions.getPublicMappedProperties();
        for (var i = 0; i < members.length; i++) {
            var item = members[i];
            if (item.type) {
                var itemResolvedDataType = _index.Container.resolveType(item.type);
                if (itemResolvedDataType && itemResolvedDataType.isAssignableTo && itemResolvedDataType.isAssignableTo(_index2.default.EntitySet)) {
                    var elementType = _index.Container.resolveType(item.elementType);
                    if (!elementType.storeToken) {
                        elementType.storeToken = this.storeToken;
                    }
                }
            }
        }
    },
    QueryResultModifier: function QueryResultModifier(query) {
        var self = _index2.default.ItemStore;
        var context = query.context;
        var type = query.modelBinderConfig.$type;
        if ('string' === typeof type) {
            type = _index.Container.resolveType(type);
        }

        if (type === _index2.default.Array && query.modelBinderConfig.$item && query.modelBinderConfig.$item.$type) {
            type = query.modelBinderConfig.$item.$type;
        }

        //TODO: runs when model binding missed (inmemory)
        if (typeof type === 'undefined' && query.result && query.result[0] instanceof _index2.default.Entity) {
            var navProps = !type ? [] : type.memberDefinitions.getPublicMappedProperties().filter(function (memDef) {
                return !!memDef.inverseProperty;
            });

            for (var i = 0; i < query.result.length; i++) {
                self._setStoreAlias(query.result[i], context.storeToken);

                for (var j = 0; j < navProps.length; j++) {
                    var navProp = navProps[j];
                    if (query.result[i][navProp.name] instanceof _index2.default.Entity) {
                        self._setStoreAlias(query.result[i][navProp.name], context.storeToken);
                    } else if (Array.isArray(query.result[i][navProp.name])) {
                        for (var k = 0; k < query.result[i][navProp.name].length; k++) {
                            if (query.result[i][navProp.name][k] instanceof _index2.default.Entity) {
                                self._setStoreAlias(query.result[i][navProp.name][k], context.storeToken);
                            }
                        }
                    }
                }
            }
        }
    }
});
_index2.default.ItemStore = new _index2.default.ItemStoreClass();

_index2.default.Entity.addMember('field', function (propName) {
    var def = this.memberDefinitions.getMember(propName);
    if (def) {
        if (def.definedBy === this) {
            return new _index2.default.MemberWrapper(def);
        } else {
            _index.Guard.raise(new _index.Exception("Member '" + propName + "' defined on '" + def.definedBy.fullName + "'!", 'Invalid Operation'));
        }
    } else {
        _index.Guard.raise(new _index.Exception("Member '" + propName + "' not exists!", 'Invalid Operation'));
    }

    return this;
}, true);

_index2.default.Class.define('$data.MemberWrapper', null, null, {
    constructor: function constructor(memberDefinition) {
        this.memberDefinition = memberDefinition;
    },
    setKey: function setKey(value) {
        this.memberDefinition.key = value || value === undefined ? true : false;
        return this;
    },
    setComputed: function setComputed(value) {
        this.memberDefinition.computed = value || value === undefined ? true : false;
        return this;
    },
    setRequired: function setRequired(value) {
        this.memberDefinition.required = value || value === undefined ? true : false;
        return this;
    },
    setNullable: function setNullable(value) {
        this.memberDefinition.nullable = value || value === undefined ? true : false;
        return this;
    },
    changeDefinition: function changeDefinition(attr, value) {
        this.memberDefinition[attr] = value;
        return this;
    }
});

exports.default = _index2.default;
module.exports = exports['default'];