'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)("$data.Expressions.GlobalContextProcessor", _index2.default.Expressions.ParameterProcessor, null, {
    constructor: function constructor(global) {
        ///<param name="global" type="object" />
        this.global = global;
    },

    canResolve: function canResolve(paramExpression) {
        ///<param name="paramExpression" type="$data.Expressions.ParameterExpression" />
        return (paramExpression.nodeType == _index2.default.Expressions.ExpressionType.Parameter || _index2.default.defaults.parameterResolutionCompatibility && paramExpression.nodeType == _index2.default.Expressions.ExpressionType.ParameterReference) && this.global && _typeof(this.global) === 'object' && paramExpression.name in this.global;
    },

    resolve: function resolve(paramExpression) {
        ///<param name="paramExpression" type="$data.Expressions.ParameterExpression" />
        ///<returns type="$data.Expressions.ExpressionNode" />
        var resultValue = this.global[paramExpression.name];
        var expression = _index.Container.createConstantExpression(resultValue, typeof resultValue === 'undefined' ? 'undefined' : _typeof(resultValue), paramExpression.name);
        return expression;
    }

});

(0, _index.$C)("$data.Expressions.ConstantValueResolver", _index2.default.Expressions.ParameterProcessor, null, {
    constructor: function constructor(paramsObject, global, scopeContext) {
        ///<param name="global" type="object" />
        this.globalResolver = _index.Container.createGlobalContextProcessor(global);
        this.paramResolver = _index.Container.createGlobalContextProcessor(paramsObject);
        this.paramsObject = paramsObject;
        this.scopeContext = scopeContext;
    },

    canResolve: function canResolve(paramExpression) {
        ///<param name="paramExpression" type="$data.Expressions.ParameterExpression" />
        if (_index2.default.defaults.parameterResolutionCompatibility) {
            return paramExpression.name === '$context' || paramExpression.nodeType == _index2.default.Expressions.ExpressionType.This && this.paramsObject ? true : this.paramResolver.canResolve(paramExpression) || this.globalResolver.canResolve(paramExpression);
        }
        return paramExpression.name === '$context' ? true : this.paramResolver.canResolve(paramExpression);
    },

    resolve: function resolve(paramExpression) {
        ///<param name="paramExpression" type="$data.Expressions.ParameterExpression" />
        ///<returns type="$data.Expressions.ExpressionNode" />
        if (paramExpression.name === '$context') {
            return _index.Container.createEntityContextExpression(this.scopeContext);
        }
        if (_index2.default.defaults.parameterResolutionCompatibility) {
            if (paramExpression.nodeType == _index2.default.Expressions.ExpressionType.This) {
                return _index.Container.createConstantExpression(this.paramsObject, _typeof(this.paramsObject), 'this');
            }
            return this.paramResolver.canResolve(paramExpression) ? this.paramResolver.resolve(paramExpression) : this.globalResolver.resolve(paramExpression);
        }
        return this.paramResolver.resolve(paramExpression);
    }

});

exports.default = _index2.default;
module.exports = exports['default'];