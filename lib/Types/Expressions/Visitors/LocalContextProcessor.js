"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _index = require("../../../TypeSystem/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)("$data.Expressions.LocalContextProcessor", _index2.default.Expressions.GlobalContextProcessor, null, {
    constructor: function constructor(evalMethod) {
        ///<param name="global" type="object" />
        this.canResolve = function (paramExpression) {
            ///<param name="paramExpression" type="$data.Expressions.ParameterExpression" />
            return paramExpression.nodeType == _index2.default.Expressions.ExpressionType.Parameter && evalMethod("typeof " + paramExpression.name) !== 'undefined';
        };
        this.resolve = function (paramExpression) {
            ///<param name="paramExpression" type="$data.Expressions.ParameterExpression" />
            ///<returns type="$data.Expressions.ExpressionNode" />
            var resultValue = evalMethod(paramExpression.name);
            var expression = _index.Container.createConstantExpression(resultValue, typeof resultValue === "undefined" ? "undefined" : _typeof(resultValue));
            return expression;
        };
    }
});

exports.default = _index2.default;
module.exports = exports['default'];