'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

var _SqLiteCompiler = require('./SqLiteCompiler.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.sqLite.SqlOrderCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor(provider) {
        this.provider = provider;
    },
    compile: function compile(expression, sqlBuilder) {
        this.Visit(expression, sqlBuilder);
    },
    VisitEntitySetExpression: function VisitEntitySetExpression(expression, sqlBuilder) {
        /// <param name="expression" type="$data.Expressions.EntitySetExpression"></param>
        /// <param name="sqlBuilder" type="$data.sqLite.SqlBuilder"></param>

        var alias = sqlBuilder.getExpressionAlias(expression);
        sqlBuilder.addText(alias);
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.nameSeparator);
    },
    VisitOrderExpression: function VisitOrderExpression(expression, sqlBuilder) {
        this.Visit(expression.selector, sqlBuilder);
        if (expression.nodeType == _core2.default.Expressions.ExpressionType.OrderByDescending) {
            sqlBuilder.addText(" DESC");
        } else {
            sqlBuilder.addText(" ASC");
        }
    },
    VisitParametricQueryExpression: function VisitParametricQueryExpression(expression, sqlBuilder) {
        this.Visit(expression.expression, sqlBuilder);
    },
    VisitEntityFieldExpression: function VisitEntityFieldExpression(expression, sqlBuilder) {
        this.Visit(expression.source, sqlBuilder);
        this.Visit(expression.selector, sqlBuilder);
    },
    VisitMemberInfoExpression: function VisitMemberInfoExpression(expression, sqlBuilder) {
        sqlBuilder.addText(expression.memberName);
    },
    VisitComplexTypeExpression: function VisitComplexTypeExpression(expression, sqlBuilder) {
        this.Visit(expression.source, sqlBuilder);
        this.Visit(expression.selector, sqlBuilder);
        sqlBuilder.addText('__');
    }
});