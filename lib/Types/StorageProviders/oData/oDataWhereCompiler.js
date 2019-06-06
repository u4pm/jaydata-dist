'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.storageProviders.oData.oDataWhereCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor(provider, lambdaPrefix) {
        this.provider = provider;
        this.entityContext = provider.context;
        this.lambdaPrefix = lambdaPrefix;
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
        context.data += "(";
        //TODO refactor!!!
        if (expression.nodeType == "in") {
            _core.Guard.requireType("expression.right", expression.type, _core2.default.Expressions.ConstantExpression);
            var paramValue = expression.right.value;
            if (!(paramValue instanceof Array)) {
                _core.Guard.raise(new _core.Exception("Right to the 'in' operator must be an array value"));
            }
            var result = null;
            var orResolution = { mapTo: "or", dataType: "boolean", name: "or" };
            var eqResolution = { mapTo: "eq", dataType: "boolean", name: "equal" };

            paramValue.forEach(function (item) {
                var idValue = item;
                var idCheck = _core.Container.createSimpleBinaryExpression(expression.left, idValue, _core2.default.Expressions.ExpressionType.Equal, "==", "boolean", eqResolution);
                if (result) {
                    result = _core.Container.createSimpleBinaryExpression(result, idCheck, _core2.default.Expressions.ExpressionType.Or, "||", "boolean", orResolution);
                } else {
                    result = idCheck;
                };
            });
            var temp = context.data;
            context.data = '';
            this.Visit(result, context);
            context.data = temp + context.data.replace(/\(/g, '').replace(/\)/g, '');
        } else {
            this.Visit(expression.left, context);
            context.data += " ";
            context.data += expression.resolution.mapTo;
            context.data += " ";
            this.Visit(expression.right, context);
        };
        context.data += ")";
    },

    VisitEntityFieldExpression: function VisitEntityFieldExpression(expression, context) {
        this.Visit(expression.source, context);
        if (expression.source instanceof _core2.default.Expressions.ComplexTypeExpression) {
            context.data += "/";
        }
        this.Visit(expression.selector, context);
    },

    VisitAssociationInfoExpression: function VisitAssociationInfoExpression(expression, context) {
        var propName = expression.associationInfo.FromPropertyName;
        var sm = this.entityContext._storageModel.getStorageModel(expression.associationInfo.FromType.inheritsFrom);
        if (sm && !sm.IsComplexType) {
            propName = expression.associationInfo.FromType.fullName + "/" + propName;
        }
        context.data += propName;
    },

    VisitMemberInfoExpression: function VisitMemberInfoExpression(expression, context) {
        var sm = this.entityContext._storageModel.getStorageModel(expression.memberDefinition.definedBy.inheritsFrom);
        if (sm && !sm.IsComplexType) {
            context.data += expression.memberDefinition.definedBy.fullName + "/" + expression.memberName;
        } else {
            context.data += expression.memberName;
        };
    },

    VisitComplexTypeExpression: function VisitComplexTypeExpression(expression, context) {
        this.Visit(expression.source, context);

        if (expression.source instanceof _core2.default.Expressions.ComplexTypeExpression) {
            context.data += "/";
        }

        this.Visit(expression.selector, context);
    },

    VisitQueryParameterExpression: function VisitQueryParameterExpression(expression, context) {
        var typeName = _core.Container.resolveName(expression.type);

        var converter = this.provider.fieldConverter.toDb[typeName];
        var value = converter ? converter(expression.value) : expression.value;

        converter = this.provider.fieldConverter.escape[typeName];
        context.data += converter ? converter(value) : value;
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
    },

    VisitConstantExpression: function VisitConstantExpression(expression, context) {
        var typeName = _core.Container.resolveName(expression.type);

        var converter = this.provider.fieldConverter.toDb[typeName];
        var value = converter ? converter(expression.value) : expression.value;

        converter = this.provider.fieldConverter.escape[typeName];
        context.data += converter ? converter(value) : value;
    },

    VisitEntityExpression: function VisitEntityExpression(expression, context) {
        this.Visit(expression.source, context);

        if (this.lambdaPrefix && expression.selector.lambda) {
            context.lambda = expression.selector.lambda;
            context.data += expression.selector.lambda + '/';
        }

        //if (expression.selector instanceof $data.Expressions.EntityExpression) {
        //    this.Visit(expression.selector, context);
        //}
    },

    VisitEntitySetExpression: function VisitEntitySetExpression(expression, context) {
        this.Visit(expression.source, context);
        if (expression.selector instanceof _core2.default.Expressions.AssociationInfoExpression) {
            this.Visit(expression.selector, context);
            context.data += "/";
        }
    },

    VisitFrameOperationExpression: function VisitFrameOperationExpression(expression, context) {
        this.Visit(expression.source, context);

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

        for (var i = 0; i < args.length; i++) {
            var arg = args[i];

            if (!opDef.method) {
                var compiler = new _core2.default.storageProviders.oData.oDataWhereCompiler(this.provider, true);
                var frameContext = { data: "" };

                if (arg && arg.value instanceof _core2.default.Queryable) {
                    var preparator = _core.Container.createQueryExpressionCreator(arg.value.entityContext);
                    var prep_expression = preparator.Visit(arg.value.expression);
                    arg = prep_expression;
                } else if (arg) {
                    arg = arg.selector;
                }

                var compiled = compiler.compile(arg, frameContext);

                if (frameContext.data) {
                    context.data += frameContext.lambda + ': ' + frameContext.data;
                }
            }
        }
        context.data += ")";
    }
});