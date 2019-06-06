'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.storageProviders.mongoDB.mongoDBCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor() {
        this.context = {};
        this.provider = {};
        this.includes = [];
        this.mainEntitySet = null;
    },
    compile: function compile(query) {
        this.provider = query.context.storageProvider;
        this.context = query.context;
        this.mainEntitySet = query.context.getEntitySetFromElementType(query.defaultType);
        this.query = query;

        query.find = {
            query: {},
            options: {}
        };

        this.Visit(query.expression, query.find);

        query.includes = this.includes;

        query.modelBinderConfig = {};
        var modelBinder = new _core2.default.modelBinder.mongoDBModelBinderConfigCompiler(query, this.includes.filter(function (it) {
            return it.mapped;
        }), true);
        modelBinder.Visit(query.expression);

        delete query.find.field;
        delete query.find.value;
        delete query.find.data;
        delete query.find.stack;
        delete query.find.or;

        return query;
    },
    VisitOrderExpression: function VisitOrderExpression(expression, context) {
        this.Visit(expression.source, context);

        var orderCompiler = new _core2.default.storageProviders.mongoDB.mongoDBOrderCompiler(this.provider, null, this);
        orderCompiler.compile(expression, context);
    },
    VisitPagingExpression: function VisitPagingExpression(expression, context) {
        this.Visit(expression.source, context);

        var pagingCompiler = new _core2.default.storageProviders.mongoDB.mongoDBPagingCompiler();
        pagingCompiler.compile(expression, context);
    },
    VisitFilterExpression: function VisitFilterExpression(expression, context) {
        this.Visit(expression.source, context);

        var self = this;
        var filterCompiler = new _core2.default.storageProviders.mongoDB.mongoDBFilterCompiler(this.provider, null, self);
        context.data = "";
        filterCompiler.compile(expression.selector, context);

        if (this.includes && this.includes.length) {
            context.data = "";
            context.lambda = "";
            var funcCompiler = new _core2.default.storageProviders.mongoDB.mongoDBFunctionCompiler({
                supportedBinaryOperators: {
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
                },

                supportedUnaryOperators: {
                    not: { mapTo: '!' }
                },

                supportedFieldOperations: {
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
                    }
                },

                fieldConverter: { toDb: _core2.default.typeSystem.extend({
                        '$data.ObjectID': function $dataObjectID(id) {
                            return id ? 'atob("' + id.toString() + '")' : id;
                        }
                    }, _core2.default.InMemoryConverter.escape) }
            }, null, this);
            funcCompiler.compile(expression.selector, context);
            context.filter = new Function(context.lambda, 'return ' + context.data + ';');
            context.data = "";
            context.lambda = "";
        }
    },
    VisitProjectionExpression: function VisitProjectionExpression(expression, context) {
        this.Visit(expression.source, context);

        var projectionCompiler = new _core2.default.storageProviders.mongoDB.mongoDBProjectionCompiler(this.provider, null, this);
        projectionCompiler.compile(expression, context);
    },
    VisitIncludeExpression: function VisitIncludeExpression(expression, context) {
        this.Visit(expression.source, context);

        this.includes = this.includes || [];
        var includeFragment = expression.selector.value.split('.');
        var tempData = null;
        var storageModel = this.mainEntitySet.entityContext._storageModel.getStorageModel(this.mainEntitySet.createNew);
        for (var i = 0; i < includeFragment.length; i++) {
            if (tempData) {
                tempData += '.' + includeFragment[i];
            } else {
                tempData = includeFragment[i];
            }
            var association = storageModel.Associations[includeFragment[i]];
            if (association) {
                var inc = this.includes.filter(function (include) {
                    return include.name == tempData;
                }, this);
                if (inc.length) {
                    inc[0].mapped = true;
                } else {
                    this.includes.push({ name: tempData, type: association.ToType, from: association.FromType, query: {}, options: {}, mapped: true });
                }
            } else {
                _core.Guard.raise(new _core.Exception("The given include path is invalid: " + expression.selector.value + ", invalid point: " + tempData));
            }
            storageModel = this.mainEntitySet.entityContext._storageModel.getStorageModel(association.ToType);
        }
    },
    VisitInlineCountExpression: function VisitInlineCountExpression(expression, context) {
        this.Visit(expression.source, context);
        this.query.withInlineCount = expression.selector == 'allpages' ? true : false;
    }
});