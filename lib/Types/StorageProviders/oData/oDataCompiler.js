'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(0, _core.$C)('$data.storageProviders.oData.oDataModelBinderConfigCompiler', _core2.default.modelBinder.ModelBinderConfigCompiler, null, {
    VisitEntityFieldOperationExpression: function VisitEntityFieldOperationExpression(expression, builder) {
        this.Visit(expression.source, builder);
        var opDef = expression.operation.memberDefinition;
        if (typeof opDef.projection == "function") {
            builder.modelBinderConfig.$type = opDef.returnType || opDef.dataType;
            builder.modelBinderConfig.$value = function (meta, data) {
                return opDef.projection(data[meta.$source]);
            };
        }
        if (opDef.aggregate) {
            if (opDef.returnType || opDef.dataType) builder.modelBinderConfig.$type = opDef.returnType || opDef.dataType;
        }
    }
});

(0, _core.$C)('$data.storageProviders.oData.oDataCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor() {
        this.context = {};
        this.provider = {};
        //this.logicalType = null;
        this.includes = null;
        this.mainEntitySet = null;
    },
    compile: function compile(query) {

        this.provider = query.context.storageProvider;
        this.context = query.context;

        if (query.defaultType) {
            this.mainEntitySet = query.context.getEntitySetFromElementType(query.defaultType);
        }

        var queryFragments = { urlText: "" };

        this.Visit(query.expression, queryFragments);
        if (queryFragments.$expand) {
            queryFragments.$expand = queryFragments.$expand.toString();
        }
        var $apply = "";
        if (queryFragments.aggregate) {
            $apply = 'aggregate(' + queryFragments.aggregate.join(",") + ')';
        }
        if (queryFragments.groupby) {
            queryFragments.groupby = queryFragments.groupby.filter(function (it, i, arr) {
                return arr.indexOf(it) == i;
            });
            $apply = queryFragments.aggregate ? 'groupby((' + queryFragments.groupby.join(",") + '),' + $apply + ')' : 'groupby((' + queryFragments.groupby.join(",") + '))';
        }
        if ($apply && queryFragments.$filter) {
            $apply = 'filter(' + queryFragments.$filter + ')/' + $apply;
        }
        if ($apply) {
            queryFragments = Object.assign({}, queryFragments, {
                aggregate: [],
                groupby: [],
                $filter: "",
                $select: "",
                $apply: $apply
            });
        }

        query.modelBinderConfig = {};
        var modelBinder = _core2.default.storageProviders.oData.oDataModelBinderConfigCompiler.create(query, this.includes, true);
        modelBinder.Visit(query.expression);

        var queryText = queryFragments.urlText;
        var addAmp = false;

        if (queryFragments.$funcParams) {
            queryText += "(" + queryFragments.$funcParams + ")";
        }

        for (var name in queryFragments) {
            if (name != "urlText" && name != "actionPack" && name != "data" && name != "lambda" && name != "method" && name != "postData" && name != "_isBatchExecuteQuery" && name != "_subQueries" && name != "$funcParams" && queryFragments[name] != "") {

                if (addAmp) {
                    queryText += "&";
                } else {
                    queryText += "?";
                }
                addAmp = true;
                if (name != "$urlParams") {
                    queryText += name + '=' + queryFragments[name];
                } else {
                    queryText += queryFragments[name];
                }
            }
        }
        query.queryText = queryText;
        query.postData = queryFragments.postData;
        var result = {
            queryText: queryText,
            withInlineCount: '$inlinecount' in queryFragments || '$count' in queryFragments,
            method: queryFragments.method || 'GET',
            postData: queryFragments.postData,
            isBatchExecuteQuery: queryFragments._isBatchExecuteQuery,
            subQueries: queryFragments._subQueries,
            params: []
        };

        query._getComplitedData = function () {
            return result;
        };

        return result;
    },
    VisitOrderExpression: function VisitOrderExpression(expression, context) {
        this.Visit(expression.source, context);

        var orderCompiler = _core.Container.createoDataOrderCompiler(this.provider);
        orderCompiler.compile(expression, context);
    },
    VisitPagingExpression: function VisitPagingExpression(expression, context) {
        this.Visit(expression.source, context);

        var pagingCompiler = _core.Container.createoDataPagingCompiler(this.provider);
        pagingCompiler.compile(expression, context);
    },
    VisitIncludeExpression: function VisitIncludeExpression(expression, context) {
        this.Visit(expression.source, context);

        var includeCompiler = _core.Container.createoDataIncludeCompiler(this.provider);
        this.includes = this.includes || [];
        var includeContext = { data: context["$expand"], includes: this.includes };
        includeCompiler.compile(expression.selector, includeContext);
        context["$expand"] = includeContext.data;
    },
    VisitFindExpression: function VisitFindExpression(expression, context) {
        this.Visit(expression.source, context);

        if (expression.subMember) {
            context.urlText += "/" + expression.subMember.memberName;
        }

        if (expression.params && expression.params.length > 0) {
            context.urlText += '(';
            if (expression.params.length === 1) {
                var param = expression.params[0];
                var typeName = _core.Container.resolveName(param.type);

                var converter = this.provider.fieldConverter.toDb[typeName];
                var value = converter ? converter(param.value) : param.value;

                converter = this.provider.fieldConverter.escape[typeName];
                value = converter ? converter(param.value) : param.value;
                context.urlText += value;
            } else {
                for (var i = 0; i < expression.params.length; i++) {
                    var param = expression.params[i];
                    var typeName = _core.Container.resolveName(param.type);

                    var converter = this.provider.fieldConverter.toDb[typeName];
                    var value = converter ? converter(param.value) : param.value;

                    converter = this.provider.fieldConverter.escape[typeName];
                    value = converter ? converter(param.value) : param.value;

                    if (i > 0) context.urlText += ',';
                    context.urlText += param.name + '=' + value;
                }
            }
            context.urlText += ')';
        }
    },
    VisitProjectionExpression: function VisitProjectionExpression(expression, context) {
        this.Visit(expression.source, context);

        var projectionCompiler = _core.Container.createoDataProjectionCompiler(this.provider);
        projectionCompiler.compile(expression, context);
    },
    VisitFilterExpression: function VisitFilterExpression(expression, context) {
        ///<param name="expression" type="$data.Expressions.FilterExpression" />

        this.Visit(expression.source, context);

        var filterCompiler = _core.Container.createoDataWhereCompiler(this.provider);
        context.data = "";
        filterCompiler.compile(expression.selector, context);
        context["$filter"] = context.data;
        context.data = "";
    },
    VisitInlineCountExpression: function VisitInlineCountExpression(expression, context) {
        this.Visit(expression.source, context);
        if (this.provider.providerConfiguration.maxDataServiceVersion === "4.0") {
            context["$count"] = expression.selector.value === 'allpages';
        } else {
            context["$inlinecount"] = expression.selector.value;
        }
    },
    VisitEntitySetExpression: function VisitEntitySetExpression(expression, context) {
        this.Visit(expression.source, context);
        context.urlText += "/" + expression.instance.tableName;
        //this.logicalType = expression.instance.elementType;
        if (expression.params) {
            for (var i = 0; i < expression.params.length; i++) {
                this.Visit(expression.params[i], context);
            }
        }
    },
    VisitServiceOperationExpression: function VisitServiceOperationExpression(expression, context) {
        if (expression.boundItem) {
            context.urlText += "/" + expression.boundItem.entitySet.tableName;
            if (expression.boundItem.data instanceof _core2.default.Entity) {
                context.urlText += '(' + this.provider.getEntityKeysValue(expression.boundItem) + ')';
            }
        }
        context.urlText += "/" + (expression.cfg.namespace ? expression.cfg.namespace + "." + expression.cfg.serviceName : expression.cfg.serviceName);
        context.method = context.method || expression.cfg.method;

        //this.logicalType = expression.returnType;
        if (expression.params) {
            context.serviceConfig = expression.cfg;
            for (var i = 0; i < expression.params.length; i++) {
                this.Visit(expression.params[i], context);
            }
            delete context.serviceConfig;
        }
    },
    VisitBatchDeleteExpression: function VisitBatchDeleteExpression(expression, context) {
        this.Visit(expression.source, context);
        context.urlText += '/$batchDelete';
        context.method = 'DELETE';
    },

    VisitConstantExpression: function VisitConstantExpression(expression, context) {
        var typeName = _core.Container.resolveName(expression.type);
        if (expression.value instanceof _core2.default.Entity) typeName = _core2.default.Entity.fullName;

        var converter = this.provider.fieldConverter.toDb[typeName];
        var value = converter ? converter(expression.value, expression) : expression.value;

        if (context.method === 'GET' || !context.method) {
            converter = this.provider.fieldConverter.escape[typeName];
            value = converter ? converter(value, expression) : value;
            if (value !== undefined) {
                var serviceConfig = context.serviceConfig || {};
                var paramConfig = serviceConfig && serviceConfig.params.filter(function (p) {
                    return p.name == expression.name;
                })[0] || {};

                var useAlias = serviceConfig.namespace && (paramConfig.useAlias || serviceConfig.useAlias || this.provider.providerConfiguration.useParameterAlias || _core2.default.defaults.OData.useParameterAlias);

                var paramValue = useAlias ? "@" + expression.name : value;
                var paramName = (useAlias ? "@" : "") + expression.name;

                if (context['$funcParams']) {
                    context['$funcParams'] += ',';
                } else {
                    context['$funcParams'] = '';
                }
                context['$funcParams'] += expression.name + '=' + paramValue;

                if (useAlias) {
                    if (context['$urlParams']) {
                        context['$urlParams'] += '&';
                    } else {
                        context['$urlParams'] = '';
                    }
                    context['$urlParams'] += paramName + '=' + value;
                }
            }
        } else {
            context.postData = context.postData || {};
            context.postData[expression.name] = value;
        }
    },
    //    VisitConstantExpression: function (expression, context) {
    //        if (context['$urlParams']) { context['$urlParams'] += '&'; } else { context['$urlParams'] = ''; }
    //
    //
    //        var valueType = Container.getTypeName(expression.value);
    //
    //
    //
    //        context['$urlParams'] += expression.name + '=' + this.provider.fieldConverter.toDb[Container.resolveName(Container.resolveType(valueType))](expression.value);
    //    },


    VisitCountExpression: function VisitCountExpression(expression, context) {
        this.Visit(expression.source, context);
        context.urlText += '/$count';
    },

    VisitBatchExecuteQueryExpression: function VisitBatchExecuteQueryExpression(expression, context) {
        context.urlText += '/$batch';
        context.method = 'POST';
        context.postData = { __batchRequests: [] };
        context._isBatchExecuteQuery = true;
        context._subQueries = expression.members;

        for (var i = 0; i < expression.members.length; i++) {
            var queryable = expression.members[i];
            var compiler = new _core2.default.storageProviders.oData.oDataCompiler();
            var compiled = compiler.compile(queryable);
            context.postData.__batchRequests.push({
                requestUri: this.provider.providerConfiguration.oDataServiceHost + compiled.queryText,
                method: compiled.method,
                data: compiled.data,
                headers: compiled.headers
            });
        }
    },

    VisitDistinctExpression: function VisitDistinctExpression(expression, context) {
        var _context$groupby;

        this.Visit(expression.source, context);
        context.groupby = context.groupby || [];
        (_context$groupby = context.groupby).push.apply(_context$groupby, _toConsumableArray(context.$select.split(',')));
    },

    VisitGroupExpression: function VisitGroupExpression(expression, context) {
        var _context$groupby2;

        this.Visit(expression.source, context);

        var groupContext = Object.assign({}, context);
        var orderCompiler = _core.Container.createoDataOrderCompiler(this.provider);
        orderCompiler.compile(expression.selector, groupContext);

        context.groupby = context.groupby || [];
        (_context$groupby2 = context.groupby).push.apply(_context$groupby2, _toConsumableArray(groupContext.data.split(',')));
    }
}, {});