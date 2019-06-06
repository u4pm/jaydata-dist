'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

var _SqLiteCompiler = require('./SqLiteCompiler.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.sqLite.SqlFilterCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    VisitParametricQueryExpression: function VisitParametricQueryExpression(expression, sqlBuilder) {
        this.Visit(expression.expression, sqlBuilder);
    },

    VisitUnaryExpression: function VisitUnaryExpression(expression, sqlBuilder) {
        /// <param name="expression" type="$data.Expressions.SimpleBinaryExpression"></param>
        /// <param name="sqlBuilder" type="$data.sqLite.SqlBuilder"></param>
        sqlBuilder.addText(expression.resolution.mapTo);
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.beginGroup);
        this.Visit(expression.operand, sqlBuilder);
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.endGroup);
    },

    VisitSimpleBinaryExpression: function VisitSimpleBinaryExpression(expression, sqlBuilder) {
        /// <param name="expression" type="$data.Expressions.SimpleBinaryExpression"></param>
        /// <param name="sqlBuilder" type="$data.sqLite.SqlBuilder"></param>
        var self = this;

        if (expression.nodeType == "arrayIndex") {
            this.Visit(expression.left, sqlBuilder);
        } else {
            sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.beginGroup);

            //check null filter
            if (expression.left instanceof _core2.default.Expressions.EntityFieldExpression && expression.right instanceof _core2.default.Expressions.ConstantExpression && expression.right.value === null) {
                this.Visit(expression.left, sqlBuilder);
                sqlBuilder.addText(expression.resolution.nullMap);
            } else if (expression.right instanceof _core2.default.Expressions.EntityFieldExpression && expression.left instanceof _core2.default.Expressions.ConstantExpression && expression.left.value === null) {
                this.Visit(expression.right, sqlBuilder);
                sqlBuilder.addText(expression.resolution.nullMap);
            } else {
                this.Visit(expression.left, sqlBuilder);
                sqlBuilder.addText(" " + expression.resolution.mapTo + " ");

                if (expression.nodeType == "in") {
                    //TODO: refactor and generalize
                    _core.Guard.requireType("expression.right", expression.right, _core2.default.Expressions.ConstantExpression);
                    var set = expression.right.value;
                    if (set instanceof Array) {
                        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.beginGroup);
                        set.forEach(function (item, i) {
                            if (i > 0) sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.valueSeparator);
                            self.Visit(item, sqlBuilder);
                        });
                        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.endGroup);
                    } else if (set instanceof _core2.default.Queryable) {
                        var subsql = set.toTraceString();
                        sqlBuilder.addText("(SELECT d FROM (" + subsql.sqlText.replace(new RegExp("(T[0-9]+(\.|\s|))", "g"), "SQ$1") + "))");
                        subsql.params.forEach(function (p) {
                            sqlBuilder.addParameter(p);
                        });
                        //Guard.raise("Not yet... but coming!");
                    } else {
                        _core.Guard.raise(new _core.Exception("Only constant arrays and Queryables can be on the right side of 'in' operator", "UnsupportedType"));
                    };
                } else {
                    this.Visit(expression.right, sqlBuilder);
                }
            }

            sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.endGroup);
        }
    },

    VisitEntitySetExpression: function VisitEntitySetExpression(expression, sqlBuilder) {
        /// <param name="expression" type="$data.Expressions.EntitySetExpression"></param>
        /// <param name="sqlBuilder" type="$data.sqLite.SqlBuilder"></param>

        var alias = sqlBuilder.getExpressionAlias(expression);
        sqlBuilder.addText(alias);
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.nameSeparator);
    },
    VisitEntityFieldOperationExpression: function VisitEntityFieldOperationExpression(expression, sqlBuilder) {
        /// <param name="expression" type="$data.Expressions.EntityFieldOperationExpression"></param>
        /// <param name="sqlBuilder"></param>

        //this.Visit(expression.operation);

        _core.Guard.requireType("expression.operation", expression.operation, _core2.default.Expressions.MemberInfoExpression);
        var opDefinition = expression.operation.memberDefinition;
        var opName = opDefinition.mapTo || opDefinition.name;

        sqlBuilder.addText(opName);
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.beginGroup);
        if (opName === "like") {
            var builder = _core2.default.sqLite.SqlBuilder.create([], sqlBuilder.entityContext);
            builder.selectTextPart("fragment");
            this.Visit(expression.parameters[0], builder);
            var fragment = builder.getTextPart("fragment");
            fragment.params.forEach(function (p) {
                var v = p;
                var paramDef = opDefinition.parameters[0];
                var v = paramDef.prefix ? paramDef.prefix + v : v;
                v = paramDef.suffix ? v + paramDef.suffix : v;
                sqlBuilder.addParameter(v);
            });
            sqlBuilder.addText(fragment.text);
            sqlBuilder.addText(" , ");
            this.Visit(expression.source, sqlBuilder);
        } else {
            this.Visit(expression.source, sqlBuilder);
            expression.parameters.forEach(function (p) {
                sqlBuilder.addText(" , ");
                this.Visit(p, sqlBuilder);
            }, this);
        };

        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.endGroup);
    },
    VisitMemberInfoExpression: function VisitMemberInfoExpression(expression, sqlBuilder) {
        /// <param name="expression" type="$data.Expressions.MemberInfoExpression"></param>
        /// <param name="sqlBuilder" type="$data.sqLite.SqlBuilder"></param>

        sqlBuilder.addText(expression.memberName);
    },
    VisitQueryParameterExpression: function VisitQueryParameterExpression(expression, sqlBuilder) {
        var value = null;
        if (expression.type == "array") {
            value = expression.value[expression.index];
        } else {
            value = expression.value;
        }
        sqlBuilder.addParameter(value);
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.parameter);
    },

    VisitConstantExpression: function VisitConstantExpression(expression, sqlBuilder) {
        //var typeNameHintFromValue = Container.getTypeName(expression.value);
        var value = sqlBuilder.entityContext.storageProvider.fieldConverter.toDb[_core.Container.resolveName(_core.Container.resolveType(expression.type))](expression.value);;
        sqlBuilder.addParameter(value);
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.parameter);
    },

    VisitEntityFieldExpression: function VisitEntityFieldExpression(expression, sqlBuilder) {
        this.Visit(expression.source, sqlBuilder);
        this.Visit(expression.selector, sqlBuilder);
    },
    VisitComplexTypeExpression: function VisitComplexTypeExpression(expression, sqlBuilder) {
        this.Visit(expression.source, sqlBuilder);
        this.Visit(expression.selector, sqlBuilder);
        sqlBuilder.addText("__");
    }
});