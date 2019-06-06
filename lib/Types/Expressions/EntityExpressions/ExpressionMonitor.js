'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.ExpressionMonitor', _index2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor(monitorDefinition) {
        this.Visit = function (expression, context) {

            var result = expression;
            var methodName;
            if (this.canVisit(expression)) {

                //if (monitorDefinition.FilterExpressionNode) {

                //};

                if (monitorDefinition.VisitExpressionNode) {
                    monitorDefinition.VisitExpressionNode.apply(monitorDefinition, arguments);
                };

                methodName = "Visit" + expression.getType().name;
                if (methodName in monitorDefinition) {
                    result = monitorDefinition[methodName].apply(monitorDefinition, arguments);
                }
            }

            //apply is about 3-4 times faster then call on webkit

            var args = arguments;
            if (result !== expression) args = [result, context];
            result = _index2.default.Expressions.EntityExpressionVisitor.prototype.Visit.apply(this, args);

            args = [result, context];

            if (this.canVisit(result)) {
                var expressionTypeName = result.getType().name;
                if (monitorDefinition.MonitorExpressionNode) {
                    monitorDefinition.MonitorExpressionNode.apply(monitorDefinition, args);
                }
                methodName = "Monitor" + expressionTypeName;
                if (methodName in monitorDefinition) {
                    monitorDefinition[methodName].apply(monitorDefinition, args);
                }

                if (monitorDefinition.MutateExpressionNode) {
                    monitorDefinition.MutateExpressionNode.apply(monitorDefinition, args);
                }
                methodName = "Mutate" + expressionTypeName;
                if (methodName in monitorDefinition) {
                    result = monitorDefinition[methodName].apply(monitorDefinition, args);
                }
            }
            return result;
        };
    }
});

exports.default = _index2.default;
module.exports = exports['default'];