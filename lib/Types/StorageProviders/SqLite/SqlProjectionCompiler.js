'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

var _SqLiteCompiler = require('./SqLiteCompiler.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _core.$C)('$data.sqLite.SqlProjectionCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor() {
        this.anonymFiledPrefix = "";
        this.currentObjectLiteralName = null;
    },
    VisitProjectionExpression: function VisitProjectionExpression(expression, sqlBuilder) {
        this.Visit(expression.selector, sqlBuilder);
    },

    VisitParametricQueryExpression: function VisitParametricQueryExpression(expression, sqlBuilder) {
        if (expression.expression instanceof _core2.default.Expressions.EntityExpression) {
            this.VisitEntitySetExpression(sqlBuilder.sets[0], sqlBuilder);
            sqlBuilder.addText("rowid AS " + this.anonymFiledPrefix + _SqLiteCompiler.SqlStatementBlocks.rowIdName + ", ");
            this.VisitEntityExpressionAsProjection(expression, sqlBuilder);
        } else if (expression.expression instanceof _core2.default.Expressions.EntitySetExpression) {
            this.VisitEntitySetExpression(sqlBuilder.sets[0], sqlBuilder);
            sqlBuilder.addText("rowid AS " + this.anonymFiledPrefix + _SqLiteCompiler.SqlStatementBlocks.rowIdName + ", ");
            this.anonymFiledPrefix = sqlBuilder.getExpressionAlias(expression.expression) + '__';
            this.MappedFullEntitySet(expression.expression, sqlBuilder);
        } else if (expression.expression instanceof _core2.default.Expressions.ObjectLiteralExpression) {
            this.VisitEntitySetExpression(sqlBuilder.sets[0], sqlBuilder);
            sqlBuilder.addText("rowid AS " + this.anonymFiledPrefix + _SqLiteCompiler.SqlStatementBlocks.rowIdName + ", ");
            this.Visit(expression.expression, sqlBuilder);
        } else {
            this.VisitEntitySetExpression(sqlBuilder.sets[0], sqlBuilder);
            sqlBuilder.addText("rowid");
            sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.as);
            sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.rowIdName);
            sqlBuilder.addText(', ');
            sqlBuilder.addKeyField(_SqLiteCompiler.SqlStatementBlocks.rowIdName);
            this.Visit(expression.expression, sqlBuilder);
            if (!(expression.expression instanceof _core2.default.Expressions.ComplexTypeExpression)) {
                sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.as);
                sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.scalarFieldName);
            }
        }
    },

    VisitEntityExpressionAsProjection: function VisitEntityExpressionAsProjection(expression, sqlBuilder) {
        var ee = expression.expression;
        var alias = sqlBuilder.getExpressionAlias(ee.source);

        var localPrefix = this.anonymFiledPrefix + (expression.fieldName ? expression.fieldName : '');
        localPrefix = localPrefix ? localPrefix + '__' : '';

        ee.storageModel.PhysicalType.memberDefinitions.getPublicMappedProperties().forEach(function (memberInfo, index) {
            if (index > 0) {
                sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.valueSeparator);
            }

            var fieldName = localPrefix + memberInfo.name;

            sqlBuilder.addText(alias);
            sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.nameSeparator);
            sqlBuilder.addText(memberInfo.name);
            sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.as);
            sqlBuilder.addText(fieldName);
        }, this);
    },

    VisitEntityFieldOperationExpression: function VisitEntityFieldOperationExpression(expression, sqlBuilder) {
        /// <param name="expression" type="$data.Expressions.EntityFieldOperationExpression"></param>
        /// <param name="sqlBuilder"></param>

        _core.Guard.requireType("expression.operation", expression.operation, _core2.default.Expressions.MemberInfoExpression);
        var opDefinition = expression.operation.memberDefinition;
        var opName = opDefinition.mapTo || opDefinition.name;

        sqlBuilder.addText(opName);
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.beginGroup);
        if (opName === "like") {
            var builder = _core2.default.sqLite.SqlBuilder.create();
            this.Visit(expression.parameters[0], builder);
            builder.params.forEach(function (p) {
                var v = p;
                var paramDef = opDefinition.parameters[0];
                var v = paramDef.prefix ? paramDef.prefix + v : v;
                v = paramDef.suffix ? v + paramDef.suffix : v;
                sqlBuilder.addParameter(v);
            });
            sqlBuilder.addText(builder.sql);
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

    VisitUnaryExpression: function VisitUnaryExpression(expression, sqlBuilder) {
        /// <param name="expression" type="$data.Expressions.SimpleBinaryExpression"></param>
        /// <param name="sqlBuilder" type="$data.sqLite.SqlBuilder"></param>
        sqlBuilder.addText(expression.resolution.mapTo);
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.beginGroup);
        this.Visit(expression.operand, sqlBuilder);
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.endGroup);
    },

    VisitSimpleBinaryExpression: function VisitSimpleBinaryExpression(expression, sqlBuilder) {
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.beginGroup);
        this.Visit(expression.left, sqlBuilder);
        var self = this;
        sqlBuilder.addText(" " + expression.resolution.mapTo + " ");
        if (expression.nodeType == "in") {
            //TODO: refactor and generalize
            _core.Guard.requireType("expression.right", expression.right, _core2.default.Expressions.ConstantExpression);
            var set = expression.right.value;
            if (set instanceof Array) {
                sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.beginGroup);
                set.forEach(function (item, i) {
                    if (i > 0) sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.valueSeparator);
                    var c = _core.Container.createConstantExpression(item);
                    self.Visit(c, sqlBuilder);
                });
                sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.endGroup);
            } else if (set instanceof _core2.default.Queryable) {
                _core.Guard.raise("not yet... but coming");
            } else {
                _core.Guard.raise(new _core.Exception("Only constant arrays and Queryables can be on the right side of 'in' operator", "UnsupportedType"));
            };
        } else {
            this.Visit(expression.right, sqlBuilder);
        }
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.endGroup);
    },

    VisitConstantExpression: function VisitConstantExpression(expression, sqlBuilder) {
        var value = expression.value;
        sqlBuilder.addParameter(value);
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.parameter);
    },

    VisitEntityFieldExpression: function VisitEntityFieldExpression(expression, sqlBuilder) {
        if (expression.source instanceof _core2.default.Expressions.ComplexTypeExpression) {
            var alias = sqlBuilder.getExpressionAlias(expression.source.source.source);
            var storageModel = expression.source.source.storageModel.ComplexTypes[expression.source.selector.memberName];
            var member = storageModel.ReferentialConstraint.filter(function (item) {
                return item[expression.source.selector.memberName] == expression.selector.memberName;
            })[0];
            if (!member) {
                _core.Guard.raise(new _core.Exception('Compiler error! ComplexType does not contain ' + expression.source.selector.memberName + ' property!'));return;
            }

            sqlBuilder.addText(alias);
            sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.nameSeparator);
            sqlBuilder.addText(member[storageModel.From]);
        } else {
            this.Visit(expression.source, sqlBuilder);
            this.Visit(expression.selector, sqlBuilder);
        }
    },

    VisitEntitySetExpression: function VisitEntitySetExpression(expression, sqlBuilder) {
        var alias = sqlBuilder.getExpressionAlias(expression);
        sqlBuilder.addText(alias);
        sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.nameSeparator);
    },

    VisitComplexTypeExpression: function VisitComplexTypeExpression(expression, sqlBuilder) {
        var alias = sqlBuilder.getExpressionAlias(expression.source.source);
        var storageModel = expression.source.storageModel.ComplexTypes[expression.selector.memberName];
        storageModel.ReferentialConstraint.forEach(function (constrain, index) {
            if (index > 0) {
                sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.valueSeparator);
            }
            sqlBuilder.addText(alias);
            sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.nameSeparator);
            sqlBuilder.addText(constrain[storageModel.From]);
            sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.as);
            sqlBuilder.addText(this.anonymFiledPrefix + constrain[storageModel.To]);
        }, this);
    },

    VisitMemberInfoExpression: function VisitMemberInfoExpression(expression, sqlBuilder) {
        /// <param name="expression" type="$data.Expressions.MemberInfoExpression"></param>
        /// <param name="sqlBuilder" type="$data.sqLite.SqlBuilder"></param>
        sqlBuilder.addText(expression.memberName);
    },

    VisitObjectLiteralExpression: function VisitObjectLiteralExpression(expression, sqlBuilder) {
        var membersNumber = expression.members.length;
        for (var i = 0; i < membersNumber; i++) {
            if (i != 0) {
                sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.valueSeparator);
            }
            this.Visit(expression.members[i], sqlBuilder);
        }
    },
    MappedFullEntitySet: function MappedFullEntitySet(expression, sqlBuilder) {
        var alias = sqlBuilder.getExpressionAlias(expression);
        var properties = expression.storageModel.PhysicalType.memberDefinitions.getPublicMappedProperties();
        properties.forEach(function (prop, index) {
            if (!prop.association) {
                if (index > 0) {
                    sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.valueSeparator);
                }
                sqlBuilder.addText(alias);
                sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.nameSeparator);
                sqlBuilder.addText(prop.name);
                sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.as);
                sqlBuilder.addText(this.anonymFiledPrefix + prop.name);
            }
        }, this);
        //ToDo: complex type
    },
    VisitObjectFieldExpression: function VisitObjectFieldExpression(expression, sqlBuilder) {

        var tempObjectLiteralName = this.currentObjectLiteralName;
        if (this.currentObjectLiteralName) {
            this.currentObjectLiteralName += '.' + expression.fieldName;
        } else {
            this.currentObjectLiteralName = expression.fieldName;
        }

        if (expression.expression instanceof _core2.default.Expressions.EntityExpression) {
            this.VisitEntityExpressionAsProjection(expression, sqlBuilder);
        } else {

            var tmpPrefix = this.anonymFiledPrefix;
            this.anonymFiledPrefix += expression.fieldName + "__";

            if (expression.expression instanceof _core2.default.Expressions.EntitySetExpression) {
                this.MappedFullEntitySet(expression.expression, sqlBuilder);
            } else {
                this.Visit(expression.expression, sqlBuilder);
            }

            this.anonymFiledPrefix = tmpPrefix;

            if (!(expression.expression instanceof _core2.default.Expressions.ObjectLiteralExpression) && !(expression.expression instanceof _core2.default.Expressions.ComplexTypeExpression) && !(expression.expression instanceof _core2.default.Expressions.EntitySetExpression)) {
                sqlBuilder.addText(_SqLiteCompiler.SqlStatementBlocks.as);
                sqlBuilder.addText(this.anonymFiledPrefix + expression.fieldName);
            }
        }
        this.currentObjectLiteralName = tempObjectLiteralName;
    }

}, null);