"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("../../../TypeSystem/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)("$data.Expressions.LambdaParameterProcessor", _index2.default.Expressions.ParameterProcessor, null, {
    constructor: function constructor(lambdaParameterTypeInfos) {
        ///<param name="global" />
        ///<param name="evalMethod" />
        var paramIndices = {};
        var $idx = "name";

        this.canResolve = function (paramExpression, context) {
            if (paramExpression.nodeType == _index2.default.Expressions.ExpressionType.LambdaParameter) {
                var fnParams = paramExpression.owningFunction.parameters;

                if (fnParams.length == 1 && paramExpression.name == fnParams[0].name) {
                    paramIndices[paramExpression.name] = lambdaParameterTypeInfos[0];
                    return true;
                }

                for (var j = 0; j < fnParams.length; j++) {
                    if (fnParams[j].name == paramExpression.name) {
                        paramIndices[paramExpression.name] = lambdaParameterTypeInfos[j];
                        return true;
                    }
                }
                return false;
            }
            return false;
        };

        this.resolve = function (paramExpression, context) {
            var lambdaParamType = paramIndices[paramExpression.name];
            var result = _index.Container.createParameterExpression(paramExpression.name, lambdaParamType, _index2.default.Expressions.ExpressionType.LambdaParameter);
            result.owningFunction = paramExpression.owningFunction;
            return result;
        };
    }

});

exports.default = _index2.default;
module.exports = exports['default'];