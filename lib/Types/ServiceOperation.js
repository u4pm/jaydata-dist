'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define('$data.ServiceOperation', null, null, {}, {
    translateDefinition: function translateDefinition(propertyDef, name, definedBy) {
        propertyDef.serviceName = name;
        var memDef = new _index2.default.MemberDefinition(this.generateServiceOperation(propertyDef), this);
        memDef.name = name;
        return memDef;
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
                var memberdef;

                var boundItem;
                if (this instanceof _index2.default.Entity || this instanceof _index2.default.EntitySet) {
                    var entitySet;
                    if (this instanceof _index2.default.Entity) {
                        if (this.context) {
                            context = this.context;
                            entitySet = context.getEntitySetFromElementType(this.getType());
                        } else if (this.storeToken && typeof this.storeToken.factory === 'function') {
                            context = this.storeToken.factory();
                            entitySet = context.getEntitySetFromElementType(this.getType());
                        } else {
                            _index.Guard.raise(new _index.Exception("entity can't resolve context", 'Not Found!', this));
                            return;
                        }
                    } else if (this instanceof _index2.default.EntitySet) {
                        context = this.entityContext;
                        entitySet = this;

                        var esDef = context.getType().getMemberDefinition(entitySet.name);
                        memberdef = _index2.default.MemberDefinition.translateDefinition(esDef.actions[cfg.serviceName], cfg.serviceName, entitySet.getType());
                    }

                    boundItem = {
                        data: this,
                        entitySet: entitySet
                    };
                }

                var virtualEntitySet = cfg.elementType ? context.getEntitySetFromElementType(_index.Container.resolveType(cfg.elementType)) : null;

                var paramConstExpression = null;
                if (cfg.params) {
                    paramConstExpression = [];
                    //object as parameter
                    //FIX: object type parameters with the same property name as the name of the first parameter
                    if (arguments[0] && _typeof(arguments[0]) === 'object' && arguments[0].constructor === _index2.default.Object && cfg.params && cfg.params[0] && cfg.params[0].name in arguments[0]) {
                        var argObj = arguments[0];
                        for (var i = 0; i < cfg.params.length; i++) {
                            var paramConfig = cfg.params[i];
                            if (paramConfig.name && paramConfig.type && paramConfig.name in argObj) {
                                paramConstExpression.push(_index.Container.createConstantExpression(argObj[paramConfig.name], _index.Container.resolveType(paramConfig.type), paramConfig.name, paramConfig.elementType));
                            }
                        }
                    }
                    //arg params
                    else {
                            for (var i = 0; i < cfg.params.length; i++) {
                                if (typeof arguments[i] == 'function') break;

                                //TODO: check params type
                                var paramConfig = cfg.params[i];
                                if (paramConfig.name && paramConfig.type && arguments[i] !== undefined) {
                                    paramConstExpression.push(_index.Container.createConstantExpression(arguments[i], _index.Container.resolveType(paramConfig.type), paramConfig.name, paramConfig.elementType));
                                }
                            }
                        }
                }

                var ec = _index.Container.createEntityContextExpression(context);
                if (!memberdef) {
                    if (boundItem && boundItem.data) {
                        memberdef = boundItem.data.getType().getMemberDefinition(cfg.serviceName);
                    } else {
                        memberdef = context.getType().getMemberDefinition(cfg.serviceName);
                    }
                }
                var es = _index.Container.createServiceOperationExpression(ec, _index.Container.createMemberInfoExpression(memberdef), paramConstExpression, cfg, boundItem);

                //Get callback function
                var clb = arguments[arguments.length - 1];
                if (!(typeof clb === 'function' || (typeof clb === 'undefined' ? 'undefined' : _typeof(clb)) === 'object' /*&& clb.constructor === $data.Object*/ && (typeof clb.success === 'function' || typeof clb.error === 'function'))) {
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

        var params = cfg.params || [];
        _index2.default.typeSystem.extend(fn, cfg, { params: params });

        return fn;
    }
});

_index2.default.Class.define('$data.ServiceAction', _index2.default.ServiceOperation, null, {}, {
    generateServiceOperation: function generateServiceOperation(cfg) {
        if (!cfg.method) {
            cfg.method = 'POST'; //default Action method is POST
        }

        return _index2.default.ServiceOperation.generateServiceOperation.apply(this, arguments);
    }
});

_index2.default.Class.define('$data.ServiceFunction', _index2.default.ServiceOperation, null, {}, {
    generateServiceOperation: function generateServiceOperation(cfg) {
        if (!cfg.method) {
            cfg.method = 'GET'; //default Function method is GET
        }

        return _index2.default.ServiceOperation.generateServiceOperation.apply(this, arguments);
    }
});

exports.default = _index2.default;
module.exports = exports['default'];