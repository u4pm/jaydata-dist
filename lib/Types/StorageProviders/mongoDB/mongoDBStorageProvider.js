'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.storageProviders.mongoDB.mongoDBProvider', _core2.default.StorageProviderBase, null, {
    constructor: function constructor(cfg, ctx) {
        this.driver = _core2.default.mongoDBDriver;
        this.context = ctx;
        this.providerConfiguration = _core2.default.typeSystem.extend({
            dbCreation: _core2.default.storageProviders.DbCreationType.DropTableIfChanged,
            address: '127.0.0.1',
            port: 27017,
            serverOptions: {},
            databaseName: 'test'
        }, cfg);
        if (this.providerConfiguration.server) {
            if (typeof this.providerConfiguration.server === 'string') this.providerConfiguration.server = [{ address: this.providerConfiguration.server.split(':')[0] || '127.0.0.1', port: this.providerConfiguration.server.split(':')[1] || 27017 }];
            if (!(this.providerConfiguration.server instanceof Array)) this.providerConfiguration.server = [this.providerConfiguration.server];
            if (this.providerConfiguration.server.length == 1) {
                this.providerConfiguration.address = this.providerConfiguration.server[0].address || '127.0.0.1';
                this.providerConfiguration.port = this.providerConfiguration.server[0].port || 27017;
                delete this.providerConfiguration.server;
            }
        }
        if (this.context && this.context._buildDbType_generateConvertToFunction && this.buildDbType_generateConvertToFunction) {
            this.context._buildDbType_generateConvertToFunction = this.buildDbType_generateConvertToFunction;
        }
        if (this.context && this.context._buildDbType_modifyInstanceDefinition && this.buildDbType_modifyInstanceDefinition) {
            this.context._buildDbType_modifyInstanceDefinition = this.buildDbType_modifyInstanceDefinition;
        }
    },
    _getServer: function _getServer() {
        if (this.providerConfiguration.server) {
            var replSet = [];
            for (var i = 0; i < this.providerConfiguration.server.length; i++) {
                var s = this.providerConfiguration.server[i];
                replSet.push(new this.driver.Server(s.address, s.port, s.serverOptions));
            }

            return new this.driver.ReplSetServers(replSet);
        } else return this.driver.Server(this.providerConfiguration.address, this.providerConfiguration.port, this.providerConfiguration.serverOptions);
    },
    initializeStore: function initializeStore(callBack) {
        var self = this;
        callBack = _core2.default.PromiseHandlerBase.createCallbackSettings(callBack);

        var server = this._getServer();
        new this.driver.Db(this.providerConfiguration.databaseName, server, { safe: false }).open(function (error, client) {
            if (error) {
                callBack.error(error);
                return;
            }

            var fn = function fn(error, client) {
                var cnt = 0;
                var collectionCount = 0;
                var readyFn = function readyFn(client, entitySet) {
                    var countFn = function countFn() {
                        if (--cnt <= 0) {
                            callBack.success(self.context);
                            client.close();
                        }
                    };

                    if (entitySet) {
                        var entitySetIndices = self.context._storageModel.getStorageModel(entitySet.createNew).indices;
                        if (entitySetIndices && typeof self._createIndices === 'function') {
                            self._createIndices(client, entitySet, entitySetIndices, countFn);
                        } else countFn();
                    } else countFn();
                };

                for (var i in self.context._entitySetReferences) {
                    if (self.context._entitySetReferences.hasOwnProperty(i)) cnt++;
                }

                collectionCount = cnt;
                var sets = Object.keys(self.context._entitySetReferences);
                if (!sets.length) return readyFn(client);
                sets.forEach(function (i) {
                    if (self.context._entitySetReferences.hasOwnProperty(i)) {
                        client.listCollections().toArray(function (error, collections) {
                            var names = collections.map(function (it) {
                                return it.name.slice(it.name.lastIndexOf('.') + 1);
                            });
                            switch (self.providerConfiguration.dbCreation) {
                                case _core2.default.storageProviders.DbCreationType.DropAllExistingTables:
                                    if (names.indexOf(self.context._entitySetReferences[i].tableName) >= 0) {
                                        client.dropCollection(self.context._entitySetReferences[i].tableName, function (error, result) {
                                            if (error) {
                                                callBack.error(error);
                                                return;
                                            }
                                            if (self.context._entitySetReferences[i].tableOptions) {
                                                client.createCollection(self.context._entitySetReferences[i].tableName, self.context._entitySetReferences[i].tableOptions, function (error, result) {
                                                    if (error) {
                                                        callBack.error(error);
                                                        return;
                                                    }
                                                    readyFn(client, self.context._entitySetReferences[i]);
                                                });
                                            } else readyFn(client, self.context._entitySetReferences[i]);
                                        });
                                    } else if (names.indexOf(self.context._entitySetReferences[i].tableName) < 0 && self.context._entitySetReferences[i].tableOptions) {
                                        client.createCollection(self.context._entitySetReferences[i].tableName, self.context._entitySetReferences[i].tableOptions, function (error, result) {
                                            if (error) {
                                                callBack.error(error);
                                                return;
                                            }
                                            readyFn(client, self.context._entitySetReferences[i]);
                                        });
                                    } else readyFn(client, self.context._entitySetReferences[i]);
                                    break;
                                default:
                                    if (names.indexOf(self.context._entitySetReferences[i].tableName) < 0 && self.context._entitySetReferences[i].tableOptions) {
                                        client.createCollection(self.context._entitySetReferences[i].tableName, self.context._entitySetReferences[i].tableOptions, function (error, result) {
                                            if (error) {
                                                callBack.error(error);
                                                return;
                                            }
                                            readyFn(client, self.context._entitySetReferences[i]);
                                        });
                                    } else readyFn(client, self.context._entitySetReferences[i]);
                                    break;
                            }
                        });
                    }
                });
            };

            if (self.providerConfiguration.username) {
                client.authenticate(self.providerConfiguration.username, self.providerConfiguration.password || '', function (error, result) {
                    if (error) {
                        callBack.error(error);
                        return;
                    }

                    if (result) {
                        fn(error, client);
                        return;
                    }
                });
            } else fn(error, client);
        });
    },
    _connected: function _connected(oid, prop, prop2, it, association) {
        var ret = false;
        association.ReferentialConstraint.forEach(function (ref) {
            if (it && ref[prop2] && oid[ref[prop2]] != undefined) ret = JSON.stringify(oid[ref[prop2]]) == JSON.stringify(it[ref[prop]] != undefined ? it[ref[prop]] : it._id);
        });
        return ret;
    },
    _compile: function _compile(query) {
        return new _core2.default.storageProviders.mongoDB.mongoDBCompiler().compile(query);
    },
    getTraceString: function getTraceString(queryable) {
        return this._compile(queryable);
    },
    executeQuery: function executeQuery(query, callBack) {
        var self = this;
        callBack = _core2.default.PromiseHandlerBase.createCallbackSettings(callBack);

        var entitySet = query.context.getEntitySetFromElementType(query.defaultType);
        this._compile(query);

        var server = this._getServer();
        new this.driver.Db(this.providerConfiguration.databaseName, server, { safe: false }).open(function (error, client) {
            if (error) {
                callBack.error(error);
                return;
            }

            var collection = client.collection(entitySet.tableName); //new self.driver.Collection(client, entitySet.tableName);
            var includes = query.includes && query.includes.length ? query.includes.map(function (it) {
                //if (it.full){
                delete it.options.fields;
                //}
                return {
                    name: it.name,
                    type: it.type,
                    from: it.from,
                    collection: client.collection(query.context.getEntitySetFromElementType(it.type).tableName), //new self.driver.Collection(client, query.context.getEntitySetFromElementType(it.type).tableName),
                    query: it.query || {},
                    options: it.options || {}
                };
            }) : null;

            query.context = self.context;
            var find = query.find;

            var cb = function cb(error, results) {
                if (error) {
                    callBack.error(error);
                    return;
                }
                if (query.find.filter) {
                    results = results.filter(query.find.filter);
                }

                if (query.expression.nodeType === _core2.default.Expressions.ExpressionType.Count || query.expression.nodeType === _core2.default.Expressions.ExpressionType.BatchDelete) {
                    if (results instanceof Array) {
                        query.rawDataList = [{ cnt: results.length }];
                    } else {
                        query.rawDataList = [{ cnt: results }];
                    }
                } else {
                    query.rawDataList = results;
                }

                callBack.success(query);
                client.close();
            };

            var fn = function fn() {
                switch (query.expression.nodeType) {
                    case _core2.default.Expressions.ExpressionType.BatchDelete:
                        collection.remove(find.query, { safe: true }, cb);
                        break;
                    case _core2.default.Expressions.ExpressionType.Count:
                        if (!includes || !includes.length) {
                            collection.find(find.query, find.options).count(cb);
                            break;
                        }
                    default:
                        if (find.full) {
                            delete find.options.fields;
                        }
                        var defaultFn = function defaultFn() {
                            collection.find(find.query, find.options).toArray(function (error, results) {
                                if (error) {
                                    callBack.error(error);
                                    return;
                                }

                                var fn = function fn(include) {
                                    include.collection.find({}, include.options).toArray(function (error, included) {
                                        if (error) {
                                            callBack.error(error);
                                            return;
                                        }

                                        var path = include.name.split('.');
                                        var prop = path[path.length - 1];
                                        var sm = self.context._storageModel.getStorageModel(include.from);

                                        var association = sm.Associations[prop];

                                        var conn = function conn(res) {
                                            if (association.FromMultiplicity == '0..1' && association.ToMultiplicity == '*') {
                                                var r = included.filter(function (it) {
                                                    return self._connected(it, association.ToPropertyName, association.To, res, association);
                                                });
                                                res[prop] = r;
                                            } else if (association.FromMultiplicity == '*' && association.ToMultiplicity == '0..1') {
                                                var r = included.filter(function (it) {
                                                    if (res[association.FromPropertyName] === null) return false;
                                                    return self._connected(res, association.FromPropertyName, association.From, it, association);
                                                })[0];
                                                res[prop] = r || res[prop];
                                            } else if (association.FromMultiplicity == '1' && association.ToMultiplicity == '0..1') {
                                                var r = included.filter(function (it) {
                                                    return self._connected(it, association.ToPropertyName, association.To, res, association);
                                                })[0];
                                                res[prop] = r || res[prop];
                                            } else if (association.FromMultiplicity == '0..1' && association.ToMultiplicity == '1') {
                                                var r = included.filter(function (it) {
                                                    return self._connected(res, association.FromPropertyName, association.From, it, association);
                                                })[0];
                                                res[prop] = r || res[prop];
                                            }
                                        };

                                        var respath = function respath(res, path) {
                                            var _conn = true;
                                            for (var j = 0; j < path.length; j++) {
                                                if (typeof res[path[j]] !== 'undefined') res = res[path[j]];
                                                if (Array.isArray(res) && res.length) {
                                                    _conn = false;
                                                    for (var k = 0; k < res.length; k++) {
                                                        if (j < path.length - 1) respath(res[k], path.slice(j));else conn(res[k]);
                                                    }
                                                }
                                                if (!_conn) break;
                                            }
                                            if (_conn) {
                                                conn(res);
                                            }
                                        };

                                        for (var i = 0; i < results.length; i++) {
                                            respath(results[i], path.slice(0, -1));
                                        }

                                        if (include.options.sort) {
                                            var order = Object.keys(include.options.sort);
                                            var cmp = order.map(function (it) {
                                                return new Function('it', 'return it.' + it + ';');
                                            });
                                            results.sort(function (a, b) {
                                                var result;
                                                for (var i = 0, l = order.length; i < l; i++) {
                                                    result = 0;
                                                    var aVal = cmp[i](a);
                                                    var bVal = cmp[i](b);

                                                    if (include.options.sort[order[i]] == 1) result = aVal === bVal ? 0 : aVal > bVal || bVal === null ? 1 : -1;else result = aVal === bVal ? 0 : aVal < bVal || aVal === null ? 1 : -1;

                                                    if (result !== 0) break;
                                                }
                                                return result;
                                            });
                                        }

                                        if (includes && includes.length) {
                                            fn(includes.shift());
                                        } else {
                                            cb(error, results);
                                        }
                                    });
                                };

                                if (includes && includes.length) {
                                    fn(includes.shift());
                                } else {
                                    cb(error, results);
                                }
                            });
                        };
                        if (query.withInlineCount) {
                            collection.find(find.query, {}).count(function (err, result) {
                                if (error) {
                                    callBack.error(error);
                                    return;
                                }
                                query.__count = result;
                                defaultFn();
                            });
                        } else defaultFn();
                        break;
                }
            };

            if (self.providerConfiguration.username) {
                client.authenticate(self.providerConfiguration.username, self.providerConfiguration.password, function (error, result) {
                    if (error) {
                        callBack.error(error);
                        return;
                    }

                    if (result) fn();else callBack.error('Authentication failed');
                });
            } else fn();
        });
    },
    _typeFactory: function _typeFactory(type, value, converter) {
        if (value && value.$ref && value.$id || value == null || value == undefined) return value;
        var type = _core.Container.resolveName(type);
        var converterFn = converter ? converter[type] : undefined;
        return converter && converter[type] ? converter[type](value) : new (_core.Container.resolveType(type))(value);
    },
    _saveCollections: function _saveCollections(callBack, collections) {
        var self = this;
        var successItems = 0;
        var server = this._getServer();

        var counterState = 0;
        var counterFn = function counterFn(callback) {
            if (--counterState <= 0) callback();
        };

        var insertFn = function insertFn(client, c, collection) {
            var docs = [];
            for (var i = 0; i < c.insertAll.length; i++) {
                var d = c.insertAll[i];
                var props = _core.Container.resolveType(d.type).memberDefinitions.getPublicMappedProperties();
                for (var j = 0; j < props.length; j++) {
                    var p = props[j];
                    if (p.concurrencyMode === _core2.default.ConcurrencyMode.Fixed) {
                        d.data[p.name] = 0;
                    } else if (!p.computed) {
                        if (_core.Container.resolveType(p.type) === _core2.default.Array && p.elementType && _core.Container.resolveType(p.elementType) === _core2.default.ObjectID) {
                            d.data[p.name] = self._typeFactory(p.type, d.data[p.name], self.fieldConverter.toDb);
                            var arr = d.data[p.name];
                            if (arr) {
                                for (var k = 0; k < arr.length; k++) {
                                    arr[k] = self._typeFactory(p.elementType, arr[k], self.fieldConverter.toDb);
                                }
                            }
                        } else {
                            d.data[p.name] = self._typeFactory(p.type, d.data[p.name], self.fieldConverter.toDb);
                            if (d.data[p.name] && d.data[p.name].initData) d.data[p.name] = d.data[p.name].initData;
                        }
                    } else {
                        d.data['_id'] = self._typeFactory(p.type, d.data._id, self.fieldConverter.toDb);
                    }
                }

                docs.push(d.data);
            }

            collection.insert(docs, { safe: true }, function (error, result) {
                if (error) {
                    callBack.error(error);
                    client.close();
                    return;
                }

                for (var k = 0; k < result.length; k++) {
                    var it = result[k];
                    var d = c.insertAll[k];
                    var props = _core.Container.resolveType(d.type).memberDefinitions.getPublicMappedProperties();
                    for (var j = 0; j < props.length; j++) {
                        var p = props[j];
                        if (!p.inverseProperty) {
                            d.entity[p.name] = self._typeFactory(p.type, it[p.computed ? '_id' : p.name], self.fieldConverter.fromDb);
                        }
                    }
                }

                successItems += result.length;

                if (c.removeAll && c.removeAll.length) {
                    removeFn(client, c, collection);
                } else {
                    if (c.updateAll && c.updateAll.length) {
                        updateFn(client, c, collection);
                    } else {
                        esFn(client, successItems);
                    }
                }
            });
        };

        var updateFn = function updateFn(client, c, collection) {
            counterState = c.updateAll.length;
            for (var i = 0; i < c.updateAll.length; i++) {
                var u = c.updateAll[i];
                var where = {};

                var keys = _core.Container.resolveType(u.type).memberDefinitions.getKeyProperties();
                for (var j = 0; j < keys.length; j++) {
                    var k = keys[j];
                    where[k.computed ? '_id' : k.name] = self.fieldConverter.toDb[_core.Container.resolveName(_core.Container.resolveType(k.type))](u.entity[k.name]);
                }

                var set = {};
                var props = _core.Container.resolveType(u.entity.getType()).memberDefinitions.getPublicMappedProperties().concat(_core.Container.resolveType(u.physicalData.getType()).memberDefinitions.getPublicMappedProperties());
                for (var j = 0; j < props.length; j++) {
                    var p = props[j];
                    if (u.entity.changedProperties.indexOf(p) >= 0 || u.physicalData.changedProperties && u.physicalData.changedProperties.indexOf(p) >= 0) {
                        if (p.concurrencyMode === _core2.default.ConcurrencyMode.Fixed) {
                            where[p.name] = self._typeFactory(p.type, u.data[p.name], self.fieldConverter.toDb);
                            if (!set.$inc) set.$inc = {};
                            set.$inc[p.name] = 1;
                        } else if (!p.computed) {
                            if (typeof u.data[p.name] === 'undefined') continue;
                            if (_core.Container.resolveType(p.type) === _core2.default.Array && p.elementType && _core.Container.resolveType(p.elementType) === _core2.default.ObjectID) {
                                set[p.name] = self._typeFactory(p.type, u.physicalData[p.name], self.fieldConverter.toDb);
                                var arr = set[p.name];
                                if (arr) {
                                    for (var k = 0; k < arr.length; k++) {
                                        arr[k] = self._typeFactory(p.elementType, arr[k], self.fieldConverter.toDb);
                                    }
                                }
                            } else {
                                set[p.name] = self._typeFactory(p.type, u.physicalData[p.name], self.fieldConverter.toDb);
                            }
                        }
                    }
                }

                var fn = function fn(u) {
                    collection.update(where, { $set: set }, { safe: true }, function (error, result) {
                        if (error) {
                            callBack.error(error);
                            client.close();
                            return;
                        }

                        if (result) {
                            successItems++;
                            var props = _core.Container.resolveType(u.type).memberDefinitions.getPublicMappedProperties();
                            for (var j = 0; j < props.length; j++) {
                                var p = props[j];
                                if (p.concurrencyMode === _core2.default.ConcurrencyMode.Fixed) u.entity[p.name]++;
                            }

                            counterFn(function () {
                                esFn(client, successItems);
                            });
                        } else {
                            counterState--;
                            collection.find({ _id: where._id }, {}).toArray(function (error, result) {
                                if (error) {
                                    callBack.error(error);
                                    return;
                                }

                                var it = result[0];
                                var props = _core.Container.resolveType(u.type).memberDefinitions.getPublicMappedProperties();
                                for (var j = 0; j < props.length; j++) {
                                    var p = props[j];
                                    u.entity[p.name] = self._typeFactory(p.type, it[p.computed ? '_id' : p.name], self.fieldConverter.fromDb);
                                }

                                counterFn(function () {
                                    esFn(client, successItems);
                                });
                            });
                        }
                    });
                };

                fn(u);
            }
        };

        var removeFn = function removeFn(client, c, collection) {
            counterState = c.removeAll.length;
            for (var i = 0; i < c.removeAll.length; i++) {
                var r = c.removeAll[i];

                for (var j in r.data) {
                    if (r.data[j] === undefined || r.data[j] === null) {
                        delete r.data[j];
                    }
                }

                var keys = _core.Container.resolveType(r.type).memberDefinitions.getKeyProperties();
                for (var j = 0; j < keys.length; j++) {
                    var k = keys[j];
                    r.data[k.computed ? '_id' : k.name] = self.fieldConverter.toDb[_core.Container.resolveName(_core.Container.resolveType(k.type))](r.entity[k.name]);
                }

                var props = _core.Container.resolveType(r.type).memberDefinitions.getPublicMappedProperties();
                for (var j = 0; j < props.length; j++) {
                    var p = props[j];
                    if (!p.key) {
                        delete r.data[p.name];
                    }
                }

                collection.remove(r.data, { safe: true }, function (error, result) {
                    if (error) {
                        callBack.error(error);
                        client.close();
                        return;
                    }

                    if (result) successItems++;else counterState--;

                    counterFn(function () {
                        if (c.updateAll && c.updateAll.length) {
                            updateFn(client, c, collection);
                        } else esFn(client, successItems);
                    });
                });
            }
        };

        var keys = Object.keys(collections);
        var readyFn = function readyFn(client, value) {
            callBack.success(value);
            client.close();
        };

        var esFn = function esFn(client, value) {
            if (keys.length) {
                var es = keys.pop();
                if (collections.hasOwnProperty(es)) {
                    var c = collections[es];
                    var collection = client.collection(es); //new self.driver.Collection(client, es);
                    if (c.insertAll && c.insertAll.length) {
                        insertFn(client, c, collection);
                    } else {
                        if (c.removeAll && c.removeAll.length) {
                            removeFn(client, c, collection);
                        } else {
                            if (c.updateAll && c.updateAll.length) {
                                updateFn(client, c, collection);
                            } else {
                                readyFn(client, 0);
                            }
                        }
                    }
                }
            } else readyFn(client, value);
        };

        new this.driver.Db(this.providerConfiguration.databaseName, server, { safe: false }).open(function (error, client) {
            if (error) {
                callBack.error(error);
                return;
            }

            if (self.providerConfiguration.username) {
                client.authenticate(self.providerConfiguration.username, self.providerConfiguration.password, function (error, result) {
                    if (error) {
                        callBack.error(error);
                        return;
                    }

                    if (result) esFn(client);
                });
            } else esFn(client);
        });
    },
    saveChanges: function saveChanges(callBack, changedItems) {
        var self = this;
        if (changedItems.length) {
            var independentBlocks = this.buildIndependentBlocks(changedItems);
            var convertedItems = [];
            var successCount = 0;
            var fn = function fn(block) {
                var collections = {};
                for (var i = 0; i < block.length; i++) {
                    convertedItems.push(block[i].data);

                    var es = collections[block[i].entitySet.name];
                    if (!es) {
                        es = {};
                        collections[block[i].entitySet.name] = es;
                    }

                    var initData = { entity: block[i].data, data: self.save_getInitData(block[i], convertedItems), physicalData: block[i].physicalData, type: _core.Container.resolveName(block[i].data.getType()) };
                    switch (block[i].data.entityState) {
                        case _core2.default.EntityState.Unchanged:
                            continue;break;
                        case _core2.default.EntityState.Added:
                            if (!es.insertAll) es.insertAll = [];
                            es.insertAll.push(initData);
                            break;
                        case _core2.default.EntityState.Modified:
                            if (!es.updateAll) es.updateAll = [];
                            es.updateAll.push(initData);
                            break;
                        case _core2.default.EntityState.Deleted:
                            if (!es.removeAll) es.removeAll = [];
                            es.removeAll.push(initData);
                            break;
                        default:
                            _core.Guard.raise(new _core.Exception("Not supported Entity state"));
                    }
                }

                self._saveCollections({
                    success: function success(cnt) {
                        successCount += cnt;
                        if (independentBlocks.length) {
                            fn(independentBlocks.shift());
                        } else {
                            callBack.success(successCount);
                        }
                    },
                    error: callBack.error
                }, collections);
            };

            if (independentBlocks.length) {
                fn(independentBlocks.shift());
            }
        } else {
            callBack.success(0);
        }
    },
    buildDbType_generateConvertToFunction: function buildDbType_generateConvertToFunction(storageModel) {
        var self = this;
        return function (logicalEntity) {
            var dbInstance = new storageModel.PhysicalType();
            dbInstance.entityState = logicalEntity.entityState;

            storageModel.PhysicalType.memberDefinitions.getPublicMappedProperties().forEach(function (property) {
                dbInstance.initData[property.name] = logicalEntity[property.name];
            }, this);

            if (storageModel.Associations) {
                storageModel.Associations.forEach(function (association) {
                    if (association.FromMultiplicity == "*" && association.ToMultiplicity == "0..1" || association.FromMultiplicity == "0..1" && association.ToMultiplicity == "1") {
                        var complexInstance = logicalEntity[association.FromPropertyName];
                        if (complexInstance !== undefined) {
                            association.ReferentialConstraint.forEach(function (constrain) {
                                if (complexInstance !== null) {
                                    dbInstance.initData[association.FromPropertyName] = {
                                        $ref: self._entitySetReferences[association.To].tableName,
                                        $id: self.storageProvider._typeFactory(complexInstance.getType().memberDefinitions.getMember(constrain[association.To]).type, complexInstance[constrain[association.To]], self.storageProvider.fieldConverter.toDb)
                                    };
                                    dbInstance.initData[constrain[association.From]] = self.storageProvider._typeFactory(complexInstance.getType().memberDefinitions.getMember(constrain[association.To]).type, complexInstance[constrain[association.To]], self.storageProvider.fieldConverter.toDb);
                                    dbInstance._setPropertyChanged(dbInstance.getType().memberDefinitions.getMember(constrain[association.From]));
                                } else {
                                    dbInstance.initData[association.FromPropertyName] = null;
                                    dbInstance.initData[constrain[association.From]] = null;
                                    dbInstance._setPropertyChanged(dbInstance.getType().memberDefinitions.getMember(constrain[association.From]));
                                }
                            }, this);
                        }
                    }
                }, this);
            }
            if (storageModel.ComplexTypes) {
                storageModel.ComplexTypes.forEach(function (cmpType) {
                    var complexInstance = logicalEntity[cmpType.FromPropertyName];
                    dbInstance.initData[cmpType.FromPropertyName] = self.storageProvider._typeFactory(cmpType.ToType, complexInstance, self.storageProvider.fieldConverter.toDb);
                }, this);
            }
            return dbInstance;
        };
    },
    buildDbType_modifyInstanceDefinition: function buildDbType_modifyInstanceDefinition(instanceDefinition, storageModel) {
        var buildDbType_copyPropertyDefinition = function buildDbType_copyPropertyDefinition(propertyDefinition, refProp) {
            var cPropertyDef;
            if (refProp) {
                cPropertyDef = JSON.parse(JSON.stringify(instanceDefinition[refProp]));
                cPropertyDef.kind = propertyDefinition.kind;
                cPropertyDef.name = propertyDefinition.name;
                cPropertyDef.notMapped = false;
            } else {
                cPropertyDef = JSON.parse(JSON.stringify(propertyDefinition));
            }

            cPropertyDef.dataType = _core.Container.resolveType(propertyDefinition.dataType);
            cPropertyDef.type = cPropertyDef.dataType;
            cPropertyDef.key = false;
            cPropertyDef.computed = false;
            return cPropertyDef;
        };
        var buildDbType_createConstrain = function buildDbType_createConstrain(foreignType, dataType, propertyName, prefix) {
            var constrain = new Object();
            constrain[foreignType.name] = propertyName;
            constrain[dataType.name] = prefix + '__' + propertyName;
            return constrain;
        };

        if (storageModel.Associations) {
            storageModel.Associations.forEach(function (association) {
                var addToEntityDef = false;
                var foreignType = association.FromType;
                var dataType = association.ToType;
                var foreignPropName = association.ToPropertyName;

                association.ReferentialConstraint = association.ReferentialConstraint || [];

                if (association.FromMultiplicity == "*" && association.ToMultiplicity == "0..1" || association.FromMultiplicity == "0..1" && association.ToMultiplicity == "1") {
                    foreignType = association.ToType;
                    dataType = association.FromType;
                    foreignPropName = association.FromPropertyName;
                    addToEntityDef = true;
                }

                foreignType.memberDefinitions.getPublicMappedProperties().filter(function (d) {
                    return d.key;
                }).forEach(function (d) {
                    if (addToEntityDef) {
                        instanceDefinition[foreignPropName + '__' + d.name] = buildDbType_copyPropertyDefinition(d, foreignPropName);
                    }
                    association.ReferentialConstraint.push(buildDbType_createConstrain(foreignType, dataType, d.name, foreignPropName));
                }, this);
            }, this);
        }
    },
    save_getInitData: function save_getInitData(item, convertedItems) {
        var self = this;
        item.physicalData = this.context._storageModel.getStorageModel(item.data.getType()).PhysicalType.convertTo(item.data, convertedItems);
        var serializableObject = {};
        item.physicalData.getType().memberDefinitions.asArray().forEach(function (memdef) {
            if (memdef.kind == _core2.default.MemberTypes.navProperty || memdef.kind == _core2.default.MemberTypes.complexProperty || memdef.kind == _core2.default.MemberTypes.property && !memdef.notMapped) {
                serializableObject[memdef.computed ? '_id' : memdef.name] = item.physicalData[memdef.name];
            }
        }, this);
        return serializableObject;
    },

    supportedDataTypes: {
        value: [_core2.default.Integer, _core2.default.String, _core2.default.Number, _core2.default.Blob, _core2.default.Boolean, _core2.default.Date, _core2.default.ObjectID, _core2.default.Object, _core2.default.GeographyPoint, _core2.default.Guid, _core2.default.GeographyLineString, _core2.default.GeographyPolygon, _core2.default.GeographyMultiPoint, _core2.default.GeographyMultiLineString, _core2.default.GeographyMultiPolygon, _core2.default.GeographyCollection, _core2.default.GeometryPoint, _core2.default.GeometryLineString, _core2.default.GeometryPolygon, _core2.default.GeometryMultiPoint, _core2.default.GeometryMultiLineString, _core2.default.GeometryMultiPolygon, _core2.default.GeometryCollection, _core2.default.Byte, _core2.default.SByte, _core2.default.Decimal, _core2.default.Float, _core2.default.Int16, _core2.default.Int32, _core2.default.Int64, _core2.default.Time, _core2.default.DateTimeOffset, _core2.default.Day, _core2.default.Duration],
        writable: false
    },

    supportedBinaryOperators: {
        value: {
            equal: { mapTo: ':', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression] },
            notEqual: { mapTo: '$ne', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression] },
            equalTyped: { mapTo: ':', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression] },
            notEqualTyped: { mapTo: '$ne', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression] },
            greaterThan: { mapTo: '$gt', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression] },
            greaterThanOrEqual: { mapTo: '$gte', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression] },

            lessThan: { mapTo: '$lt', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression] },
            lessThenOrEqual: { mapTo: '$lte', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression] },
            or: { mapTo: '$or', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression] },
            and: { mapTo: '$and', dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression] },

            "in": { mapTo: "$in", allowedIn: [_core2.default.Expressions.FilterExpression] }
        }
    },

    supportedUnaryOperators: {
        value: {
            not: { mapTo: '$nor' }
        }
    },

    supportedFieldOperations: {
        value: {
            contains: {
                dataType: "boolean", allowedIn: [_core2.default.Expressions.FilterExpression],
                parameters: [{ name: "substring", dataType: "string" }]
            },

            startsWith: {
                dataType: "string", allowedIn: [_core2.default.Expressions.FilterExpression],
                parameters: [{ name: "@expression", dataType: "string" }, { name: "strFragment", dataType: "string" }]
            },

            endsWith: {
                dataType: "string", allowedIn: [_core2.default.Expressions.FilterExpression],
                parameters: [{ name: "@expression", dataType: "string" }, { name: "strFragment", dataType: "string" }]
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
            batchDelete: {},
            single: {},
            take: {},
            skip: {},
            orderBy: {},
            orderByDescending: {},
            first: {},
            include: {},
            withInlineCount: {},
            some: {
                invokable: false,
                allowedIn: [_core2.default.Expressions.FilterExpression],
                parameters: [{ name: "filter", dataType: "$data.Queryable" }],
                mapTo: 'some',
                frameType: _core2.default.Expressions.SomeExpression
            },
            every: {
                invokable: false,
                allowedIn: [_core2.default.Expressions.FilterExpression],
                parameters: [{ name: "filter", dataType: "$data.Queryable" }],
                mapTo: 'every',
                frameType: _core2.default.Expressions.EveryExpression
            }
        },
        enumerable: true,
        writable: true
    },
    fieldConverter: { value: _core2.default.mongoDBConverter }
}, {
    isSupported: {
        get: function get() {
            if (!_core2.default.mongoDBDriver) {
                try {
                    _core2.default.mongoDBDriver = require('mongodb');
                    _core2.default.StorageProviderBase.registerProvider('mongoDB', _core2.default.storageProviders.mongoDB.mongoDBProvider);
                    return true;
                } catch (err) {
                    return false;
                }
            }
            return true;
        },
        set: function set(value) {}
    }
});

if (_core2.default.storageProviders.mongoDB.mongoDBProvider.isSupported) {
    _core2.default.StorageProviderBase.registerProvider('mongoDB', _core2.default.storageProviders.mongoDB.mongoDBProvider);
}