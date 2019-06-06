'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.storageProviders.mongoDB.mongoDBFunctionCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor(provider, lambdaPrefix, compiler) {
        this.provider = provider;
        if (compiler) {
            this.compiler = compiler;
            this.includes = compiler.includes;
            this.mainEntitySet = compiler.mainEntitySet;
        }
    },
    compile: function compile(expression, context) {
        this.Visit(expression, context);
    },

    VisitParametricQueryExpression: function VisitParametricQueryExpression(expression, context) {
        this.Visit(expression.expression, context);
    },
    VisitUnaryExpression: function VisitUnaryExpression(expression, context) {
        context.data += this.provider.supportedBinaryOperators[expression.resolution.name].mapTo;
        context.data += "(";
        this.Visit(expression.operand, context);
        context.data += ")";
    },
    VisitSimpleBinaryExpression: function VisitSimpleBinaryExpression(expression, context) {
        if (expression.resolution.reverse) {
            context.data += "(";
            var right = this.Visit(expression.right, context);
            context.data += this.provider.supportedBinaryOperators[expression.resolution.name].mapTo;
            var left = this.Visit(expression.left, context);
            if (expression.resolution.rightValue) context.data += expression.resolution.rightValue;
            context.data += ")";
        } else {
            context.data += "(";
            var left = this.Visit(expression.left, context);
            context.data += this.provider.supportedBinaryOperators[expression.resolution.name].mapTo;
            var right = this.Visit(expression.right, context);
            context.data += ")";
        }
    },

    VisitConstantExpression: function VisitConstantExpression(expression, context) {
        var type = _core.Container.resolveType(expression.type);
        var typeName = _core.Container.resolveName(type);
        context.data += this.provider.fieldConverter.toDb[typeName](expression.value);
    },
    VisitMemberInfoExpression: function VisitMemberInfoExpression(expression, context) {
        var member = context.data.slice(context.data.lastIndexOf('(') + 1);
        if (_core.Container.resolveType(expression.memberDefinition.type) == _core2.default.ObjectID) {
            context.data += expression.memberDefinition.computed ? '_id ? ' + member + '_id.toString() : ' + member + '_id)' : expression.memberName + ' ? ' + member + expression.memberName + '.toString() : ' + member + expression.memberName + ')';
        } else {
            context.data += expression.memberDefinition.computed ? '_id)' : expression.memberName + ')';
        }
    },

    VisitComplexTypeExpression: function VisitComplexTypeExpression(expression, context) {
        this.Visit(expression.source, context);
        this.Visit(expression.selector, context);
        context.data += ".";
    },

    VisitEntityExpression: function VisitEntityExpression(expression, context) {
        this.Visit(expression.source, context);
        context.entityType = expression.entityType;
        if (expression.selector.lambda) {
            context.data += '(' + expression.selector.lambda + '.';
            context.lambda = expression.selector.lambda;
        }
    },
    VisitEntitySetExpression: function VisitEntitySetExpression(expression, context) {
        this.Visit(expression.source, context);
        if (expression.selector instanceof _core2.default.Expressions.AssociationInfoExpression) {
            this.Visit(expression.selector, context);
        }
    },
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
    VisitAssociationInfoExpression: function VisitAssociationInfoExpression(expression, context) {
        context.data += expression.associationInfo.FromPropertyName + '.';
    },
    VisitEntityFieldOperationExpression: function VisitEntityFieldOperationExpression(expression, context) {
        _core.Guard.requireType("expression.operation", expression.operation, _core2.default.Expressions.MemberInfoExpression);

        var opDef = expression.operation.memberDefinition;
        opDef = this.provider.supportedFieldOperations[opDef.name];
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
    },
    VisitFrameOperationExpression: function VisitFrameOperationExpression(expression, context) {
        var self = this;
        this.Visit(expression.source, context);

        _core.Guard.requireType("expression.operation", expression.operation, _core2.default.Expressions.MemberInfoExpression);

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

        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            if (arg && arg.value instanceof _core2.default.Queryable) {
                var frameExpression = new opDef.frameType(arg.value.expression);
                var preparator = new _core2.default.Expressions.QueryExpressionCreator(arg.value.entityContext);
                var prep_expression = preparator.Visit(frameExpression);

                var compiler = new self.constructor(this.provider, true);
                var frameContext = { data: "" };
                var compiled = compiler.compile(prep_expression, frameContext);

                context.data += 'function(' + frameContext.lambda + '){ return ' + frameContext.data + '; }';
            } else context.data += 'function(){ return true; }';
        }
        context.data += "))";
    }
});