'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.ParameterResolverVisitor', _index2.default.Expressions.ExpressionVisitor, null, {

    constructor: function constructor(expression, resolver) {
        /// <summary>
        /// ParameterResolverVisitor traverses the JavaScript Code Expression tree and converts
        /// outer but otherwise execution local variable references into ConstantExpressions-t.
        /// for example: context.Persons.filter(function(p) { return p.Name == document.location.href })
        /// is transformed into a constant that has the current href as its value
        /// </summary>
        /// <param name="expression"></param>
        /// <param name="resolver"></param>
        this.lambdaParamCache = {};
        this.paramCache = {};
    },

    Visit: function Visit(expression, resolver) {
        ///<param name="expression" type="$data.Expressions.ExpressionNode" />
        ///<param name="resolver" type="$data.Expressions.Resolver" />
        //TODO base call is just ugly
        return _index2.default.Expressions.ExpressionVisitor.prototype.Visit.call(this, expression, resolver);
    },

    VisitArrayLiteral: function VisitArrayLiteral(eNode, context) {
        var self = this;
        var items = eNode.items.map(function (item) {
            return self.Visit(item, context);
        });
        var allLocal = items.every(function (item) {
            return item instanceof _index2.default.Expressions.ConstantExpression;
        });

        if (allLocal) {
            items = items.map(function (item) {
                return item.value;
            });
            return _index.Container.createConstantExpression(items, "array");
        } else {
            return _index.Container.createArrayLiteralExpression(items);
        }
    },

    VisitObjectLiteral: function VisitObjectLiteral(eNode, context) {
        var self = this;
        var members = eNode.members.map(function (item) {
            return self.Visit(item, context);
        });
        var allLocal = members.every(function (member) {
            return member.expression instanceof _index2.default.Expressions.ConstantExpression;
        });

        if (allLocal) {
            var params = members.map(function (member) {
                return { name: member.fieldName, value: member.expression.value };
            });
            var value = eNode.implementation(params);
            return _index.Container.createConstantExpression(value, typeof value === 'undefined' ? 'undefined' : _typeof(value));
        } else {
            return _index.Container.createObjectLiteralExpression(members);
        }
    },

    VisitThis: function VisitThis(eNode, resolver) {
        return resolver.Visit(eNode, resolver);
    },

    VisitParameter: function VisitParameter(eNode, resolver) {
        ///<param name="eNode" type="$data.Expressions.ParameterExpression" />
        ///<param name="resovler" type="$data.Expressions.ParameterResolver" />
        ///<returns type="$data.Expressions.ParameterExpression" />

        var node;
        ///TODO let the resolver handle lambdaReferences if it wants to deal with it
        switch (eNode.nodeType) {
            case _index2.default.Expressions.ExpressionType.Parameter:
                node = resolver.Visit(eNode, resolver);
                this.paramCache[node.name] = node;
                return node;
            case _index2.default.Expressions.ExpressionType.ParameterReference:
                if (_index2.default.defaults.parameterResolutionCompatibility) {
                    return resolver.Visit(eNode, resolver);
                }

                var paramNode = this.paramCache[eNode.name];
                if (paramNode) {
                    return paramNode;
                } else {
                    _index.Guard.raise("Missing parameter '" + eNode.name + "'");
                }
                break;
            case _index2.default.Expressions.ExpressionType.LambdaParameter:
                node = resolver.Visit(eNode, resolver);
                this.lambdaParamCache[node.name] = node;
                return node;
            case _index2.default.Expressions.ExpressionType.LambdaParameterReference:
                var lambdaParam = this.lambdaParamCache[eNode.name];
                if (lambdaParam) {
                    node = _index.Container.createParameterExpression(eNode.name, lambdaParam.type, _index2.default.Expressions.ExpressionType.LambdaParameterReference);
                    node.paramIndex = eNode.paramIndex;
                    //node.typeName = lambdaParam.type.name || lambdaParam.type;
                    return node;
                }
                break;
            default:
                return eNode;

        }

        return eNode;
    },

    VisitConstant: function VisitConstant(eNode, context) {
        ///<param name="eNode" type="$data.Expressions.ParameterExpression" />
        ///<returns type="$data.Expressions.ParameterExpression" />
        return eNode;
    },

    VisitFunction: function VisitFunction(eNode, context) {
        ///<param name="eNode" type="$data.Expressions.FunctionExpression" />

        var self = this;
        var params = eNode.parameters.map(function (p, i) {
            var result = self.Visit(p, context);
            return result;
        });
        var body = self.Visit(eNode.body, context);
        var result = new _index2.default.Expressions.FunctionExpression(eNode.name, params, body);

        return result;
    },

    VisitBinary: function VisitBinary(eNode, context) {
        ///<summary></summary>
        ///<param name="eNode" type="$data.Expressions.ExpressionNodeTypes.BinaryExpressionNode"/>
        ///<param name="context" type="Object"/>
        ///<return type="$data.Expressions.ExpressionNodeTypes.BinaryExpressionNode"/>

        var left = this.Visit(eNode.left, context);
        var right = this.Visit(eNode.right, context);
        var expr = _index2.default.Expressions;

        if (left instanceof expr.ConstantExpression && right instanceof expr.ConstantExpression) {
            var result = eNode.implementation(left.value, right.value);
            return _index.Container.createConstantExpression(result, typeof result === 'undefined' ? 'undefined' : _typeof(result));
        }
        return new _index.Container.createSimpleBinaryExpression(left, right, eNode.nodeType, eNode.operator, eNode.type);
    },

    VisitUnary: function VisitUnary(eNode, context) {
        ///<summary></summary>
        ///<param name="eNode" type="$data.Expressions.ExpressionNodeTypes.BinaryExpressionNode"/>
        ///<param name="context" type="Object"/>
        ///<return type="$data.Expressions.ExpressionNodeTypes.BinaryExpressionNode"/>

        var operand = this.Visit(eNode.operand, context);
        //var imp = $data.unaryOperators.getOperator(
        var expr = _index2.default.Expressions;
        if (operand instanceof expr.ConstantExpression) {
            var result = eNode.operator.implementation(operand.value);
            return _index.Container.createConstantExpression(result, typeof result === 'undefined' ? 'undefined' : _typeof(result));
        }
        return new _index.Container.createUnaryExpression(operand, eNode.operator, eNode.nodeType);
    },

    VisitProperty: function VisitProperty(eNode, context) {
        ///<param name="eNode" type="$data.Expressions.PropertyExpression" />
        var expression = this.Visit(eNode.expression, context);
        var member = this.Visit(eNode.member, context);
        var result;
        if (expression instanceof _index2.default.Expressions.ConstantExpression && member instanceof _index2.default.Expressions.ConstantExpression) {
            ///TODO implement checking for the member, throw on error
            result = eNode.implementation(expression.value, member.value);

            //Method call processed before
            //if (typeof result === 'function') {
            //    return new $data.Expressions.ConstantExpression(
            //        function () { return result.apply(expression.value, arguments); });
            //}
            return _index.Container.createConstantExpression(result, typeof result === 'undefined' ? 'undefined' : _typeof(result), expression.name + '$' + member.value);
        }
        if (expression === eNode.expression && member === eNode.member) return eNode;

        result = _index.Container.createPropertyExpression(expression, member);
        return result;
    },

    VisitCall: function VisitCall(eNode, context) {
        ///<param name="eNode" type="$data.Expressions.CallExpression" />
        function isExecutable(args, body, obj) {
            return body instanceof _index2.default.Expressions.ConstantExpression && (
            //global methods will not have a this.
            !obj || obj instanceof _index2.default.Expressions.ConstantExpression) && args.every(function (item) {
                return item instanceof _index2.default.Expressions.ConstantExpression;
            });
        }
        var call = _index2.default.Expressions.ExpressionVisitor.prototype.VisitCall.apply(this, arguments);
        var obj = call.expression;
        var body = call.member;
        var args = call.args;

        function convertToValue(arg) {
            if (arg instanceof _index2.default.Expressions.ConstantExpression) return arg.value;
            return arg;
        };

        if (isExecutable(args, body, obj)) {
            var fn = body.value;
            if (typeof fn === 'string' && obj.value) {
                fn = obj.value[fn];
            }
            if (typeof fn !== 'function') {
                //TODO dig that name out from somewhere
                _index.Guard.raise("Constant expression is not a method...");
            }
            var value = eNode.implementation(obj.value, fn, args.map(convertToValue));
            return new _index2.default.Expressions.ConstantExpression(value, typeof value === 'undefined' ? 'undefined' : _typeof(value));
        }
        return call;
    }
}, {});
(0, _index.$C)("$data.Expressions.AggregatedVisitor", _index2.default.Expressions.ExpressionVisitor, null, {
    constructor: function constructor(visitors) {
        ///<param name="resolver" type="Array" elementType="$data.Expression.ParameterResolver" />

        this.Visit = function (node, context) {
            for (var i = 0; i < visitors.length; i++) {
                var n = visitors[i].Visit(node, context);
                if (n !== node) return n;
            }
            return node;
        };
    }

});

exports.default = _index2.default;
module.exports = exports['default'];