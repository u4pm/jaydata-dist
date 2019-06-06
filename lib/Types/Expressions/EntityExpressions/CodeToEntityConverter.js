'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.CodeToEntityConverter', _index2.default.Expressions.ExpressionVisitor, null, {
    constructor: function constructor(scopeContext) {
        ///<summary>This visitor converts a JS language tree into a semantical Entity Expression Tree &#10;This visitor should be invoked on a CodeExpression</summary>
        ///<param name="context">context.thisArg contains parameters, context.lambdaParams should have an array value</param>
        this.scopeContext = scopeContext;
        this.parameters = [];
    },

    VisitBinary: function VisitBinary(expression, context) {
        var left = this.Visit(expression.left, context);
        var right = this.Visit(expression.right, context);

        if (!(left instanceof _index2.default.Expressions.ConstantExpression) && right instanceof _index2.default.Expressions.ConstantExpression || !(right instanceof _index2.default.Expressions.ConstantExpression) && left instanceof _index2.default.Expressions.ConstantExpression) {

            var refExpression, constExpr;
            if (right instanceof _index2.default.Expressions.ConstantExpression) {
                refExpression = left;
                constExpr = right;
            } else {
                refExpression = right;
                constExpr = left;
            }

            var memInfo;
            if ((memInfo = refExpression.selector) instanceof _index2.default.Expressions.MemberInfoExpression || (memInfo = refExpression.operation) instanceof _index2.default.Expressions.MemberInfoExpression) {

                if (memInfo.memberDefinition && (memInfo.memberDefinition.type || memInfo.memberDefinition.dataType)) {
                    var fieldType = _index.Container.resolveType(memInfo.memberDefinition.type || memInfo.memberDefinition.dataType);
                    var constExprType = _index.Container.resolveType(constExpr.type);

                    if (fieldType !== constExprType) {

                        var value = constExpr.value;
                        if (expression.operator === _index2.default.Expressions.ExpressionType.In) {
                            if (Array.isArray(value)) {
                                var resultExp = [];
                                for (var i = 0; i < value.length; i++) {
                                    resultExp.push(new _index2.default.Expressions.ConstantExpression(value[i], fieldType));
                                }
                                value = resultExp;
                                fieldType = _index2.default.Array;
                            } else {
                                fieldType = constExprType;
                            }
                        }

                        if (right === constExpr) {
                            right = new _index2.default.Expressions.ConstantExpression(value, fieldType, right.name);
                        } else {
                            left = new _index2.default.Expressions.ConstantExpression(value, fieldType, left.name);
                        }
                    }
                }
            }
        }

        var operatorResolution = this.scopeContext.resolveBinaryOperator(expression.nodeType, expression, context.frameType);
        var result = _index.Container.createSimpleBinaryExpression(left, right, expression.nodeType, expression.operator, expression.type, operatorResolution);
        return result;
    },

    VisitUnary: function VisitUnary(expression, context) {
        var operand = this.Visit(expression.operand, context);
        var operatorResolution = this.scopeContext.resolveUnaryOperator(expression.nodeType, expression, context.frameType);
        var result = _index.Container.createUnaryExpression(operand, expression.operator, expression.nodeType, operatorResolution);
        return result;
    },

    VisitParameter: function VisitParameter(expression, context) {
        _index.Guard.requireValue("context", context);
        var et = _index2.default.Expressions.ExpressionType;
        switch (expression.nodeType) {
            case et.LambdaParameterReference:
                var result = _index.Container.createEntityExpression(context.lambdaParameters[expression.paramIndex], { lambda: expression.name });
                return result;
            case et.LambdaParameter:
                //TODO: throw descriptive exception or return a value
                break;
            case et.ParameterReference:
                if (context.inCall) return _index.Container.createConstantExpression(expression.name, _index2.default.String);
            default:
                _index.Guard.raise("Parameter '" + expression.name + "' is missing!");
                break;
        }
    },

    VisitThis: function VisitThis(expression, context) {
        ///<summary>converts the ThisExpression into a QueryParameterExpression tha't value will be evaluated and stored in this.parameters collection</summary>
        var index = this.parameters.push({ name: "", value: undefined }) - 1;
        var result = _index.Container.createQueryParameterExpression("", index, context.queryParameters, undefined);
        return result;
    },

    VisitFunction: function VisitFunction(expression, context) {
        var result = _index2.default.Expressions.ExpressionVisitor.prototype.VisitFunction.apply(this, arguments);
        return result.body;
    },

    VisitCall: function VisitCall(expression, context) {
        //var exp = this.Visit(expression.expression);
        var self = this;
        context.inCall = true;
        var exp = this.Visit(expression.expression, context);
        var member = this.Visit(expression.member, context);
        delete context.inCall;
        var args = expression.args.map(function (arg) {
            if (arg instanceof _index2.default.Expressions.FunctionExpression && (exp instanceof _index2.default.Expressions.EntitySetExpression || exp instanceof _index2.default.Expressions.FrameOperationExpression)) {
                var operation = self.scopeContext.resolveSetOperations(member.value, exp, context.frameType);
                if (!operation) {
                    _index.Guard.raise("Unknown entity field operation: " + member.getJSON());
                }

                var entitySet = self.scopeContext.getEntitySetFromElementType(exp.elementType);
                var setExpr = null;
                if (!entitySet) {
                    //TODO
                    _index.Guard.raise("Nested operations without entity set is not supported");
                } else {
                    setExpr = entitySet.expression;
                }

                var frameType = context.frameType;
                context.frameType = operation.frameType;
                context.lambdaParameters.push(setExpr);
                var res = self.Visit(arg, context);
                context.lambdaParameters.pop();
                context.frameType = frameType;

                if (operation.frameTypeFactory) {
                    return operation.frameTypeFactory(setExpr, res);
                } else {
                    return new operation.frameType(setExpr, res);
                }
            } else {
                return self.Visit(arg, context);
            }
        });
        var result;

        ///filter=>function(p) { return p.Title == this.xyz.BogusFunction('asd','basd');}
        switch (true) {
            case exp instanceof _index2.default.Expressions.QueryParameterExpression:
                var argValues = args.map(function (a) {
                    return a.value;
                });
                result = expression.implementation(exp.value, member.value, argValues);
                //var args = expressions
                return _index.Container.createQueryParameterExpression(exp.name + "$" + member.value, exp.index, result, typeof result === 'undefined' ? 'undefined' : _typeof(result));
            case exp instanceof _index2.default.Expressions.EntityFieldExpression:
            case exp instanceof _index2.default.Expressions.EntityFieldOperationExpression:
            case exp instanceof _index2.default.Expressions.SimpleBinaryExpression:
            case exp instanceof _index2.default.Expressions.ConstantExpression:
                var operation = this.scopeContext.resolveFieldOperation(member.value, exp, context.frameType);
                if (!operation) {
                    _index.Guard.raise("Unknown entity field operation: " + member.getJSON());
                }
                member = _index.Container.createMemberInfoExpression(operation);
                result = _index.Container.createEntityFieldOperationExpression(exp, member, this._resolveFunctionArguments(args, operation.parameters));
                return result;

            case exp instanceof _index2.default.Expressions.EntitySetExpression:
            case exp instanceof _index2.default.Expressions.FrameOperationExpression:
                var operation = this.scopeContext.resolveSetOperations(member.value, exp, context.frameType);
                if (!operation) {
                    _index.Guard.raise("Unknown entity field operation: " + member.getJSON());
                }
                member = _index.Container.createMemberInfoExpression(operation);
                result = _index.Container.createFrameOperationExpression(exp, member, this._resolveFunctionArguments(args, operation.parameters));
                return result;

            case exp instanceof _index2.default.Expressions.EntityExpression:
                var operation = this.scopeContext.resolveTypeOperations(member.value, exp, context.frameType);
                if (!operation) {
                    _index.Guard.raise("Unknown entity function operation: " + member.getJSON());
                }

                member = _index.Container.createMemberInfoExpression(operation);
                result = _index.Container.createEntityFunctionOperationExpression(exp, member, this._resolveFunctionArguments(args, operation.method.params));
                return result;
                break;
            case exp instanceof _index2.default.Expressions.EntityContextExpression:
                var operation = this.scopeContext.resolveContextOperations(member.value, exp, context.frameType);
                if (!operation) {
                    _index.Guard.raise("Unknown entity function operation: " + member.getJSON());
                }

                member = _index.Container.createMemberInfoExpression(operation);
                result = _index.Container.createContextFunctionOperationExpression(exp, member, this._resolveFunctionArguments(args, operation.method.params));
                return result;
                break;
            default:
                _index.Guard.raise("VisitCall: Only fields can have operations: " + expression.getType().name);
            //TODO we must not alter the visited tree
        }
    },
    _resolveFunctionArguments: function _resolveFunctionArguments(args, params) {
        if (params) // remove current field poz
            params = params.filter(function (p, i) {
                return p.name !== '@expression';
            });

        //objectArgs
        if (args.length === 1 && args[0] instanceof _index2.default.Expressions.ConstantExpression && _typeof(args[0].value) === 'object' && args[0].value && params && params[0] && args[0].value.constructor === _index2.default.Object && params.some(function (param) {
            return param.name in args[0].value;
        })) {

            return params.map(function (p) {
                var type = p.type || p.dataType || args[0].type;
                return new _index2.default.Expressions.ConstantExpression(args[0].value[p.name], _index.Container.resolveType(type), p.name);
            });
        } else {
            return args.map(function (expr, i) {
                if (expr instanceof _index2.default.Expressions.ConstantExpression && params && params[i]) {
                    var type = params[i].type || params[i].dataType || expr.type;
                    return new _index2.default.Expressions.ConstantExpression(expr.value, _index.Container.resolveType(type), params[i].name);
                } else {
                    return expr;
                }
            });
        }
    },

    VisitProperty: function VisitProperty(expression, context) {
        ///<param name="expression" type="$data.Expressions.PropertyExpression" />
        var exp = this.Visit(expression.expression, context);
        var member = this.Visit(expression.member, context);

        //Guard.requireType("member", member, $data.Expressions.ConstantExpression);
        _index.Guard.requireType("member", member, _index2.default.Expressions.ConstantExpression);

        function isPrimitiveType(memberDefinitionArg) {

            var t = memberDefinitionArg.dataType;
            if (typeof t === 'function') {
                return false;
            }

            // suspicious code
            /*switch (t) {
                //TODO: implement this
            }*/
        }

        switch (exp.expressionType) {
            case _index2.default.Expressions.EntitySetExpression:
            case _index2.default.Expressions.EntityExpression:
                var memberDefinition = exp.getMemberDefinition(member.value);
                if (!memberDefinition) {
                    _index.Guard.raise(new _index.Exception("Unknown member: " + member.value, "MemberNotFound"));
                }
                //var storageMemberDefinition =
                var storageField = memberDefinition.storageModel.PhysicalType.memberDefinitions.getMember(memberDefinition.name);
                var res;
                var memberDefinitionExp;
                switch (storageField.kind) {
                    case "property":
                        memberDefinitionExp = _index.Container.createMemberInfoExpression(memberDefinition);
                        res = _index.Container.createEntityFieldExpression(exp, memberDefinitionExp);
                        return res;
                    case "navProperty":
                        var assocInfo = memberDefinition.storageModel.Associations[memberDefinition.name];
                        var setExpression = _index.Container.createEntitySetExpression(exp, _index.Container.createAssociationInfoExpression(assocInfo));
                        if (assocInfo.ToMultiplicity !== "*") {
                            var ee = _index.Container.createEntityExpression(setExpression, {});
                            return ee;
                        } /* else {
                             context.lambdaParameters.push(setExpression);
                          }*/
                        return setExpression;
                    case "complexProperty":
                        memberDefinitionExp = _index.Container.createMemberInfoExpression(memberDefinition);
                        res = _index.Container.createComplexTypeExpression(exp, memberDefinitionExp);
                        return res;
                    //TODO: missing default case
                }

            //s/switch => property or navigationproperty
            case _index2.default.Expressions.ComplexTypeExpression:
                var memDef = exp.getMemberDefinition(member.value);
                if (!memDef) {
                    _index.Guard.raise("Unknown member " + member.value + " on " + exp.entityType.name);
                }
                var memDefExp = _index.Container.createMemberInfoExpression(memDef);
                var result;
                //TODO!!!!
                if (_index.Container.isPrimitiveType(_index.Container.resolveType(memDef.dataType)) && !memDef.inverseProperty) {
                    result = _index.Container.createEntityFieldExpression(exp, memDefExp);
                    return result;
                }
                result = _index.Container.createComplexTypeExpression(exp, memDefExp);
                return result;
            case _index2.default.Expressions.QueryParameterExpression:
                var value = expression.implementation(exp.value, member.value);
                this.parameters[exp.index].name += "$" + member.value;
                this.parameters[exp.index].value = value;
                return _index.Container.createQueryParameterExpression(exp.name + "$" + member.value, exp.index, value, _index.Container.getTypeName(value));
            case _index2.default.Expressions.EntityFieldExpression:
            case _index2.default.Expressions.EntityFieldOperationExpression:
                var operation = this.scopeContext.resolveFieldOperation(member.value, exp, context.frameType);
                if (!operation) {
                    _index.Guard.raise("Unknown entity field operation: " + member.getJSON());
                }
                member = _index.Container.createMemberInfoExpression(operation);
                result = _index.Container.createEntityFieldOperationExpression(exp, member, []);

                return result;
            default:
                _index.Guard.raise("Unknown expression type to handle: " + exp.expressionType.name);
        }
    }
});

exports.default = _index2.default;
module.exports = exports['default'];