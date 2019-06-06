'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define('$data.Expressions.ExecutorVisitor', _index2.default.Expressions.ExpTreeVisitor, null, {
    //--
    VisitVariable: function VisitVariable(eNode, context) {
        if (!eNode.executable) return eNode;
        var value = eNode.name == context.paramsName ? context.paramContext : _index2.default.__global[eNode.name];
        if (typeof value == 'undefined') _index.Guard.raise(new _index.Exception("Unknown variable in '" + context.operation + "' operation. The variable isn't referenced in the parameter context and it's not a global variable: '" + eNode.name + "'.", "InvalidOperation", { operationName: context.operation, missingParameterName: eNode.name }));
        return _index2.default.Expressions.ExpressionNodeTypes.LiteralExpressionNode.create(true, typeof value === 'undefined' ? 'undefined' : _typeof(value), value);
    },
    VisitMember: function VisitMember(eNode, context) {
        if (!eNode.executable) return eNode;
        var chain = this.GetMemberChain(eNode);
        var value;
        for (var i = 0; i < chain.length; i++) {
            if (i == 0) value = context.paramContext;else value = value[chain[i].name];
        }
        return _index2.default.Expressions.ExpressionNodeTypes.LiteralExpressionNode.create(true, typeof value === 'undefined' ? 'undefined' : _typeof(value), value);
    },
    VisitUnary: function VisitUnary(eNode, context) {
        var operand = this.Visit(eNode.operand, context);
        if (operand !== eNode.operand) eNode = _index2.default.Expressions.ExpressionNodeTypes.UnaryExpressionNode.create(eNode.executable, eNode.operator, operand);
        if (!eNode.executable) return eNode;
        // executing and returning with result as a literal
        var value;
        var src;
        var operandValue = operand.valueType == "string" ? "'" + operand.value + "'" : operand.value;
        src = "value = " + eNode.operator + " " + operandValue;
        eval(src);

        return _index2.default.Expressions.ExpressionNodeTypes.LiteralExpressionNode.create(true, typeof value === 'undefined' ? 'undefined' : _typeof(value), value);
    },
    VisitIncDec: function VisitIncDec(eNode, context) {
        var operand = this.Visit(eNode.operand, context);
        if (operand !== eNode.operand) eNode = _index2.default.Expressions.ExpressionNodeTypes.IncDecExpressionNode.create(eNode.executable, eNode.operator, operand, eNode.suffix);
        if (!eNode.executable) return eNode;
        // executing and returning with result as a literal
        var value;
        if (eNode.suffix) value = eNode.operator == "++" ? operand.value++ : operand.value--;else value = eNode.operator == "++" ? ++operand.value : --operand.value;
        return _index2.default.Expressions.ExpressionNodeTypes.LiteralExpressionNode.create(true, typeof value === 'undefined' ? 'undefined' : _typeof(value), value);
    },
    VisitBinary: function VisitBinary(eNode, context) {
        var left = this.Visit(eNode.left, context);
        var right = this.Visit(eNode.right, context);
        if (left !== eNode.left || right !== eNode.right) eNode = _index2.default.Expressions.ExpressionNodeTypes.BinaryExpressionNode.create(eNode.executable, eNode.operator, left, right);
        if (!eNode.executable) return eNode;
        // executing and returning with result as a literal
        var value;
        var src;
        var leftValue = left.valueType == "string" ? "'" + left.value + "'" : left.value;
        var rightValue = right.valueType == "string" ? "'" + right.value + "'" : right.value;
        src = "value = " + leftValue + " " + eNode.operator + " " + rightValue;
        eval(src);

        return _index2.default.Expressions.ExpressionNodeTypes.LiteralExpressionNode.create(true, typeof value === 'undefined' ? 'undefined' : _typeof(value), value);
    },
    VisitEquality: function VisitEquality(eNode, context) {
        var left = this.Visit(eNode.left, context);
        var right = this.Visit(eNode.right, context);
        if (left !== eNode.left || right !== eNode.right) eNode = _index2.default.Expressions.ExpressionNodeTypes.EqualityExpressionNode.create(eNode.executable, eNode.operator, left, right);
        if (!eNode.executable) return eNode;
        // executing and returning with result as a literal
        var value;
        var src;
        var leftValue = left.valueType == "string" ? "'" + left.value + "'" : left.value;
        var rightValue = right.valueType == "string" ? "'" + right.value + "'" : right.value;
        src = "value = " + leftValue + " " + eNode.operator + " " + rightValue;
        eval(src);
        return _index2.default.Expressions.ExpressionNodeTypes.LiteralExpressionNode.create(true, typeof value === 'undefined' ? 'undefined' : _typeof(value), value);
    },
    VisitDecision: function VisitDecision(eNode, context) {
        var expression = this.Visit(eNode.expression, context);
        var left = this.Visit(eNode.left, context);
        var right = this.Visit(eNode.right, context);
        if (expression !== eNode.expression || left !== eNode.left || right !== eNode.right) eNode = _index2.default.Expressions.ExpressionNodeTypes.DecisionExpressionNode.create(eNode.executable, expression, left, right);
        if (!eNode.executable) return eNode;
        // executing and returning with result as a literal
        var value = expression.value ? left.value : right.value;
        return _index2.default.Expressions.ExpressionNodeTypes.LiteralExpressionNode.create(true, typeof value === 'undefined' ? 'undefined' : _typeof(value), value);
    },
    VisitMethodCall: function VisitMethodCall(eNode, context) {
        var object = eNode.object ? this.Visit(eNode.object, context) : null;
        var args = this.VisitArray(eNode.args, context);
        if (object !== eNode.object || args != eNode.args) eNode = _index2.default.Expressions.ExpressionNodeTypes.MethodcallExpressionNode.create(eNode.executable, object, eNode.method, args);
        if (!eNode.executable) return eNode;
        // executing and returning with result as a literal
        var a = [];
        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            var t = _typeof(arg.value);
            a.push(t == "string" ? "'" + arg.value + "'" : arg.value);
        }
        var value;
        var src = object ? "value = object.value[eNode.method](" + a.join(",") + ");" : "value = " + eNode.method + "(" + a.join(",") + ");";
        eval(src);

        return _index2.default.Expressions.ExpressionNodeTypes.LiteralExpressionNode.create(true, typeof value === 'undefined' ? 'undefined' : _typeof(value), value);
    },
    VisitArrayAccess: function VisitArrayAccess(eNode, context) {
        // { type:ARRAYACCESS, executable:true, array:, index: }
        var arrayNode = this.Visit(eNode.array, context);
        var indexNode = this.Visit(eNode.index, context);
        var value = arrayNode.value[indexNode.value];
        return _index2.default.Expressions.ExpressionNodeTypes.LiteralExpressionNode.create(true, typeof value === 'undefined' ? 'undefined' : _typeof(value), value);
    }
}, null);

exports.default = _index2.default;
module.exports = exports['default'];