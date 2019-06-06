'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.sqLite.SqlExpressionMonitor', _core2.default.Expressions.ExpressionMonitor, null, {
    constructor: function constructor(monitorDefinition) {
        this.VisitIncludeExpression = function (expression, context) {
            var newSourceExpression = this.Visit(expression.source, context);
            monitorDefinition.isMapped = true;
            var newSelectorExpresion = this.Visit(expression.selector, context);
            monitorDefinition.isMapped = false;

            if (newSourceExpression !== expression.source || newSelectorExpresion !== expression.selector) {
                return _core.Container.createIncludeExpression(newSourceExpression, newSelectorExpresion);
            }
            return expression;
        };
        this.VisitProjectionExpression = function (expression, context) {
            var source = this.Visit(expression.source, context);
            monitorDefinition.isMapped = true;
            var selector = this.Visit(expression.selector, context);
            monitorDefinition.isMapped = false;
            if (source !== expression.source || selector !== expression.selector) {
                var expr = _core.Container.createProjectionExpression(source, selector, expression.params, expression.instance);
                expr.projectionAs = expression.projectionAs;
                return expr;
            }
            return expression;
        };
    }

});