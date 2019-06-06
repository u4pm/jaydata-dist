'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.EntityExpressionVisitor', null, null, {

    constructor: function constructor() {
        this.lambdaTypes = [];
    },

    canVisit: function canVisit(expression) {
        return expression instanceof _index2.default.Expressions.ExpressionNode;
    },

    Visit: function Visit(expression, context) {
        if (!this.canVisit(expression)) return expression;

        var visitorName = "Visit" + expression.getType().name;
        if (visitorName in this) {
            var fn = this[visitorName];
            var result = fn.call(this, expression, context);
            if (typeof result === 'undefined') {
                return expression;
            }
            return result;
        }
        //console.log("unhandled expression type:" + expression.getType().name);
        return expression;
    },
    VisitToArrayExpression: function VisitToArrayExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        if (source !== expression.source) {
            return _index.Container.createToArrayExpression(source);
        }
        return expression;
    },
    VisitForEachExpression: function VisitForEachExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        if (source !== expression.source) {
            return _index.Container.createForEachExpression(source);
        }
        return expression;
    },
    VisitMemberInfoExpression: function VisitMemberInfoExpression(expression, context) {
        return expression;
    },

    VisitSingleExpression: function VisitSingleExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        if (source !== expression.source) return _index.Container.createSingleExpression(source);
        return expression;
    },

    VisitFirstExpression: function VisitFirstExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        if (source !== expression.source) return _index.Container.createFirstExpression(source);
        return expression;
    },

    VisitSomeExpression: function VisitSomeExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        if (source !== expression.source) return _index.Container.createSomeExpression(source);
        return expression;
    },

    VisitFindExpression: function VisitFindExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        if (source !== expression.source) return _index.Container.createFindExpression(source, expression.params, expression.subMember);
        return expression;
    },

    VisitEveryExpression: function VisitEveryExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        if (source !== expression.source) return _index.Container.createEveryExpression(source);
        return expression;
    },

    VisitCountExpression: function VisitCountExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        if (source !== expression.source) return _index.Container.createCountExpression(source);
        return expression;
    },

    VisitBatchDeleteExpression: function VisitBatchDeleteExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        if (source !== expression.source) {
            return _index.Container.createBatchDeleteExpression(source);
        }
        return expression;
    },

    VisitBatchExecuteQueryExpression: function VisitBatchExecuteQueryExpression(expression, context) {
        var newQueries = expression.members.map(function (expr) {
            return this.Visit(expr, context);
        }, this);

        var equal = true;
        for (var i = 0; i < expression.members.length; i++) {
            equal = equal && expression.members[i] === newQueries[i];
        }
        if (!equal) {
            return _index.Container.createBatchExecuteQueryExpression(newQueries);
        }

        return expression;
    },

    VisitObjectLiteralExpression: function VisitObjectLiteralExpression(expression, context) {
        var newValues = expression.members.map(function (ofe) {
            return this.Visit(ofe, context);
        }, this);
        var equal = true;
        for (var i = 0; i < expression.members.length; i++) {
            equal = equal && expression.members[i] === newValues[i];
        }
        if (!equal) {
            return _index.Container.createObjectLiteralExpression(newValues);
        }
        return expression;
    },
    VisitObjectFieldExpression: function VisitObjectFieldExpression(expression, context) {
        var newExpression = this.Visit(expression.expression, context);
        if (expression.expression !== newExpression) {
            return _index.Container.createObjectFieldExpression(expression.fieldName, newExpression);
        }
        return expression;
    },
    VisitIncludeExpression: function VisitIncludeExpression(expression, context) {
        var newExpression = this.Visit(expression.source, context);
        if (newExpression !== expression.source) {
            return _index.Container.createIncludeExpression(newExpression, expression.selector);
        }
        return expression;
    },

    VisitUnaryExpression: function VisitUnaryExpression(expression, context) {

        /// <param name="expression" type="$data.Expressions.UnaryExpression"></param>
        /// <param name="context"></param>
        var operand = this.Visit(expression.operand, context);
        if (expression.operand !== operand) {
            return _index.Container.createUnaryExpression(operand, expression.operator, expression.nodeType, expression.resolution);
        };
        return expression;
    },

    VisitSimpleBinaryExpression: function VisitSimpleBinaryExpression(expression, context) {
        ///<summary></summary>
        ///<param name="expression" type="$data.Expressions.SimpleBinaryExpression"/>
        ///<param name="context" type="Object"/>
        //<returns type="$data.Expressions.SimpleBinaryExpression"/>
        var left = this.Visit(expression.left, context);
        var right = this.Visit(expression.right, context);
        if (left !== expression.left || right !== expression.right) {
            return new _index2.default.Expressions.SimpleBinaryExpression(left, right, expression.nodeType, expression.operator, expression.type, expression.resolution);
        }
        return expression;
    },

    VisitEntityContextExpression: function VisitEntityContextExpression(expression, context) {
        return expression;
    },

    VisitCodeExpression: function VisitCodeExpression(expression, context) {
        /// <param name="expression" type="$data.Expressions.CodeExpression"></param>
        /// <param name="context"></param>
        /// <returns type="$data.Expressions.CodeExpression"></returns>
        return expression;
    },

    VisitComplexTypeExpression: function VisitComplexTypeExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            var result = _index.Container.createComplexTypeExpression(source, selector);
            return result;
        }
        return expression;
    },

    VisitEntityExpression: function VisitEntityExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            var result = _index.Container.createEntityExpression(source, selector);
            return result;
        }
        return expression;
    },

    VisitEntityFieldExpression: function VisitEntityFieldExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            var result = _index.Container.createEntityFieldExpression(source, selector);
            return result;
        }
        return expression;
    },

    VisitEntityFieldOperationExpression: function VisitEntityFieldOperationExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        var operation = this.Visit(expression.operation, context);
        var parameters = expression.parameters.map(function (p) {
            return this.Visit(p);
        }, this);
        var result = _index.Container.createEntityFieldOperationExpression(source, operation, parameters);
        return result;
    },

    VisitParametricQueryExpression: function VisitParametricQueryExpression(expression, context) {
        var exp = this.Visit(expression.expression, context);
        var args = expression.parameters.map(function (p) {
            return this.Visit(p);
        }, this);
        var result = _index.Container.createParametricQueryExpression(exp, args);
        return result;
    },

    VisitEntitySetExpression: function VisitEntitySetExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            return _index.Container.createEntitySetExpression(source, selector, expression.params, expression.instance);
        }
        return expression;
    },

    VisitInlineCountExpression: function VisitInlineCountExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            return _index.Container.createInlineCountExpression(source, selector, expression.params, expression.instance);
        }
        return expression;
    },

    VisitFilterExpression: function VisitFilterExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            return _index.Container.createFilterExpression(source, selector, expression.params, expression.instance);
        }
        return expression;
    },

    VisitProjectionExpression: function VisitProjectionExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            var expr = _index.Container.createProjectionExpression(source, selector, expression.params, expression.instance);
            expr.projectionAs = expression.projectionAs;
            return expr;
        }
        return expression;
    },

    VisitOrderExpression: function VisitOrderExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            return _index.Container.createOrderExpression(source, selector, expression.nodeType);
        }
        return expression;
    },
    VisitPagingExpression: function VisitPagingExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        var amount = this.Visit(expression.amount, context);
        if (source !== expression.source || amount !== expression.amount) {
            return _index.Container.createPagingExpression(source, amount, expression.nodeType);
        }
        return expression;
    },
    VisitDistinctExpression: function VisitDistinctExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            return _index.Container.createDistinctExpression(source, selector);
        }
        return expression;
    },
    VisitGroupExpression: function VisitGroupExpression(expression, context) {
        var source = this.Visit(expression.source, context);
        var selector = this.Visit(expression.selector, context);
        if (source !== expression.source || selector !== expression.selector) {
            return _index.Container.createGroupExpression(source, selector);
        }
        return expression;
    }
});

exports.default = _index2.default;
module.exports = exports['default'];