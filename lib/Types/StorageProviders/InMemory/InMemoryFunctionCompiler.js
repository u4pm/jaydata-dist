'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.storageProviders.InMemory.InMemoryFunctionCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor(provider) {
        this.provider = provider;
    },
    compile: function compile(expression, context) {
        this.Visit(expression, context);
    },

    VisitParametricQueryExpression: function VisitParametricQueryExpression(expression, context) {
        this.Visit(expression.expression, context);
    },
    VisitUnaryExpression: function VisitUnaryExpression(expression, context) {
        context.data += expression.resolution.mapTo;
        context.data += "(";
        this.Visit(expression.operand, context);
        context.data += ")";
    },
    VisitSimpleBinaryExpression: function VisitSimpleBinaryExpression(expression, context) {
        var self = this;
        if (expression.resolution.reverse) {
            context.data += "(";

            if (expression.resolution.name === 'in' && Array.isArray(expression.right.value)) {
                context.data += "[";
                expression.right.value.forEach(function (item, i) {
                    if (i > 0) context.data += ",";
                    self.Visit(item, context);
                });
                context.data += "]";
            } else {
                var right = this.Visit(expression.right, context);
            }
            context.data += expression.resolution.mapTo;
            var left = this.Visit(expression.left, context);
            if (expression.resolution.rightValue) context.data += expression.resolution.rightValue;
            context.data += ")";
        } else {
            context.data += "(";
            var left = this.Visit(expression.left, context);
            context.data += expression.resolution.mapTo;
            var right = this.Visit(expression.right, context);
            context.data += ")";
        }
    },

    VisitConstantExpression: function VisitConstantExpression(expression, context) {
        var type = _core.Container.resolveType(expression.type);
        var typeName = _core.Container.resolveName(type);
        var converter = this.provider.fieldConverter.escape[typeName];
        context.data += converter ? converter(expression.value) : expression.value;
    },
    VisitMemberInfoExpression: function VisitMemberInfoExpression(expression, context) {
        context.data += ".";
        context.data += expression.memberName;
    },

    VisitComplexTypeExpression: function VisitComplexTypeExpression(expression, context) {
        this.Visit(expression.source, context);
        this.Visit(expression.selector, context);
    },

    VisitEntityExpression: function VisitEntityExpression(expression, context) {
        context.data += expression.selector.lambda;
        context.lambda = expression.selector.lambda;
        this.Visit(expression.source, context);
    },
    VisitEntitySetExpression: function VisitEntitySetExpression() {},
    VisitObjectLiteralExpression: function VisitObjectLiteralExpression(expression, context) {
        context.data += '{ ';

        for (var i = 0; i < expression.members.length; i++) {
            var member = expression.members[i];

            if (i > 0) context.data += ', ';

            this.Visit(member, context);
        }

        context.data += ' }';
    },
    VisitObjectFieldExpression: function VisitObjectFieldExpression(expression, context) {
        context.data += expression.fieldName + ': ';
        this.Visit(expression.expression, context);
    },
    VisitEntityFieldOperationExpression: function VisitEntityFieldOperationExpression(expression, context) {
        _core.Guard.requireType("expression.operation", expression.operation, _core2.default.Expressions.MemberInfoExpression);

        //TODO refactor!
        var opDef = expression.operation.memberDefinition;
        if (opDef.propertyFunction) {
            this.Visit(expression.source, context);
            context.data += '.';
        }

        var opName = opDef.mapTo || opDef.name;
        context.data += opName;
        var paramCounter = 0;
        var params = opDef.parameters || [];

        var args = params.map(function (item, index) {
            if (item.name === "@expression") {
                return expression.source;
            } else {
                return expression.parameters[paramCounter++];
            };
        });

        args.forEach(function (arg, index) {
            if (arg) {
                if (index > 0) {
                    context.data += ",";
                };
                this.Visit(arg, context);
            }
        }, this);
        context.data += opDef.rightValue || "";
    }
});