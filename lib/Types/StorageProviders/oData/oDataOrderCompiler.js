'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.storageProviders.oData.oDataOrderCompiler', _core2.default.storageProviders.oData.oDataWhereCompiler, null, {
    constructor: function constructor(provider) {
        this.provider = provider;
        this.entityContext = provider.context;
    },

    compile: function compile(expression, context) {
        this.Visit(expression, context);
    },
    VisitOrderExpression: function VisitOrderExpression(expression, context) {
        var orderContext = { data: "" };
        this.Visit(expression.selector, orderContext);
        if (context['$orderby']) {
            context['$orderby'] += ',';
        } else {
            context['$orderby'] = '';
        }
        context['$orderby'] += orderContext.data + (expression.nodeType == _core2.default.Expressions.ExpressionType.OrderByDescending ? " desc" : "");
    },
    VisitParametricQueryExpression: function VisitParametricQueryExpression(expression, context) {
        this.Visit(expression.expression, context);
    },
    VisitEntityFieldExpression: function VisitEntityFieldExpression(expression, context) {
        this.Visit(expression.source, context);
        this.Visit(expression.selector, context);
    },
    VisitComplexTypeExpression: function VisitComplexTypeExpression(expression, context) {
        this.Visit(expression.source, context);
        this.Visit(expression.selector, context);
        context.data += "/";
    },
    VisitEntitySetExpression: function VisitEntitySetExpression(expression, context) {
        if (expression.selector instanceof _core2.default.Expressions.AssociationInfoExpression) {
            this.Visit(expression.source, context);
            this.Visit(expression.selector, context);
        }
    },
    VisitAssociationInfoExpression: function VisitAssociationInfoExpression(expression, context) {
        var propName = expression.associationInfo.FromPropertyName;
        var sm = this.entityContext._storageModel.getStorageModel(expression.associationInfo.FromType.inheritsFrom);
        if (sm && !sm.IsComplexType) {
            propName = expression.associationInfo.FromType.fullName + "/" + propName;
        }
        context.data += propName + '/';
    },
    VisitEntityExpression: function VisitEntityExpression(expression, context) {
        this.Visit(expression.source, context);
        this.Visit(expression.selector, context);
    },
    VisitMemberInfoExpression: function VisitMemberInfoExpression(expression, context) {
        var propName = expression.memberName;
        var sm = this.entityContext._storageModel.getStorageModel(expression.memberDefinition.definedBy.inheritsFrom);
        if (sm && !sm.IsComplexType) {
            propName = expression.memberDefinition.definedBy.fullName + "/" + propName;
        }
        context.data += propName;
    },
    VisitEntityFieldOperationExpression: function VisitEntityFieldOperationExpression(expression, context) {
        _core.Guard.requireType("expression.operation", expression.operation, _core2.default.Expressions.MemberInfoExpression);

        //TODO refactor!
        var opDef = expression.operation.memberDefinition;
        var opName = opDef.mapTo || opDef.name;
        context.data += opName;
        context.data += "(";
        var paramCounter = 0;
        var params = opDef.parameters || [{ name: "@expression" }];

        var args = params.map(function (item, index) {
            if (item.name === "@expression") {
                return expression.source;
            } else {
                return expression.parameters[paramCounter++];
            };
        });

        args.forEach(function (arg, index) {
            if (index > 0) {
                context.data += ",";
            };
            this.Visit(arg, context);
        }, this);
        context.data += ")";
    },
    VisitEntityFunctionOperationExpression: function VisitEntityFunctionOperationExpression(expression, context) {
        _core.Guard.requireType("expression.operation", expression.operation, _core2.default.Expressions.MemberInfoExpression);
        this.Visit(expression.source, context);

        //TODO refactor!
        var opDef = expression.operation.memberDefinition;
        var opName = opDef.mapTo || opDef.name;
        context.data += opName;
        context.data += "(";
        var paramCounter = 0;
        var params = opDef.method.params || [{ name: "@expression" }];

        var args = params.map(function (item, index) {
            if (item.name === "@expression") {
                return expression.source;
            } else {
                return expression.parameters[paramCounter++];
            };
        });

        var i = 0;
        args.forEach(function (arg, index) {
            if (arg === undefined || arg instanceof _core2.default.Expressions.ConstantExpression && typeof arg.value === 'undefined') return;

            if (i > 0) {
                context.data += ",";
            };
            i++;
            context.data += params[index].name + '=';
            this.Visit(arg, context);
        }, this);
        context.data += ")";
    },
    VisitContextFunctionOperationExpression: function VisitContextFunctionOperationExpression(expression, context) {
        return this.VisitEntityFunctionOperationExpression(expression, context);
    }
});