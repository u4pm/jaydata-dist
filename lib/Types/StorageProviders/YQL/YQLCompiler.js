'use strict';

var _core = require('../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//"use strict" // suspicious code;

(0, _core.$C)('$data.storageProviders.YQL.YQLCompiler', _core2.default.Expressions.EntityExpressionVisitor, null, {
    constructor: function constructor() {
        this.provider = {};
        this.cTypeCache = {};
    },

    compile: function compile(query) {
        this.provider = query.context.storageProvider;

        var context = {
            filterSql: { sql: '' },
            projectionSql: { sql: '' },
            orderSql: { sql: '' },
            skipSql: { sql: '' },
            takeSql: { sql: '' },
            tableName: ''
        };
        this.Visit(query.expression, context);

        if (context.projectionSql.sql == '') context.projectionSql.sql = "SELECT *";

        if (context.orderSql.sql) context.orderSql.sql = " | sort(" + context.orderSql.sql + ')';

        //special skip-take logic
        if (context.skipSql.value && context.takeSql.value) {
            var skipVal = context.skipSql.value;
            context.skipSql.value = context.takeSql.value;
            context.takeSql.value = context.takeSql.value + skipVal;
        }
        if (context.skipSql.value) context.skipSql.sql = context.skipSql.sqlPre + context.skipSql.value + context.skipSql.sqlSuf;
        if (context.takeSql.value) context.takeSql.sql = context.takeSql.sqlPre + context.takeSql.value + context.takeSql.sqlSuf;

        return {
            queryText: context.projectionSql.sql + ' FROM ' + context.tableName + context.filterSql.sql + context.orderSql.sql + context.takeSql.sql + (context.takeSql.sql ? context.skipSql.sql : ''),
            selectMapping: context.projectionSql.selectFields,
            params: []
        };
    },

    VisitFilterExpression: function VisitFilterExpression(expression, context) {
        ///<param name="expression" type="$data.Expressions.FilterExpression" />
        this.Visit(expression.source, context);

        context.filterSql.type = expression.nodeType;
        if (context.filterSql.sql == '') context.filterSql.sql = ' WHERE ';else context.filterSql.sql += ' AND ';

        this.Visit(expression.selector, context.filterSql);
    },
    VisitProjectionExpression: function VisitProjectionExpression(expression, context) {
        ///<param name="expression" type="$data.Expressions.ProjectionExpression" />
        this.Visit(expression.source, context);

        context.projectionSql.type = expression.nodeType;
        if (context.projectionSql.sql == '') context.projectionSql.sql = 'SELECT ';else _core.Guard.raise(new _core.Exception('multiple select error'));

        this.Visit(expression.selector, context.projectionSql);
    },
    VisitOrderExpression: function VisitOrderExpression(expression, context) {
        ///<param name="expression" type="$data.Expressions.OrderExpression" />
        this.Visit(expression.source, context);

        context.orderSql.type = expression.nodeType;

        var orderContext = { sql: '' };
        this.Visit(expression.selector, orderContext);
        context.orderSql.sql = "field='" + orderContext.sql + "', descending='" + (expression.nodeType == _core2.default.Expressions.ExpressionType.OrderByDescending) + "'" + (context.orderSql.sql != '' ? ', ' + context.orderSql.sql : '');
    },
    VisitPagingExpression: function VisitPagingExpression(expression, context) {
        ///<param name="expression" type="$data.Expressions.PagingExpression" />
        this.Visit(expression.source, context);

        if (expression.nodeType == _core2.default.Expressions.ExpressionType.Skip) {
            context.skipSql.type = expression.nodeType;
            context.skipSql.sqlPre = ' | tail(count=';
            this.Visit(expression.amount, context.skipSql);
            context.skipSql.sqlSuf = ')';
        } else if (expression.nodeType == _core2.default.Expressions.ExpressionType.Take) {
            context.takeSql.type = expression.nodeType;
            context.takeSql.sqlPre = ' | truncate(count=';
            this.Visit(expression.amount, context.takeSql);
            context.takeSql.sqlSuf = ')';
        }
    },

    VisitSimpleBinaryExpression: function VisitSimpleBinaryExpression(expression, context) {
        context.sql += "(";
        var left = this.Visit(expression.left, context);
        context.sql += expression.resolution.mapTo;

        if (expression.resolution.resolvableType && !_core.Guard.requireType(expression.resolution.mapTo + ' expression.right.value', expression.right.value, expression.resolution.resolvableType)) {
            _core.Guard.raise(new _core.Exception(expression.right.type + " not allowed in '" + expression.resolution.mapTo + "' statement", "invalid operation"));
        }

        if (expression.resolution.name === 'in' && expression.right.value instanceof Array) {
            var self = this;
            context.sql += "(";
            expression.right.value.forEach(function (item, i) {
                if (i > 0) context.sql += ", ";
                self.Visit(item, context);
            });
            context.sql += ")";
        } else {
            var right = this.Visit(expression.right, context);
        }
        context.sql += ")";
    },

    VisitEntityFieldExpression: function VisitEntityFieldExpression(expression, context) {
        this.Visit(expression.source, context);
        this.Visit(expression.selector, context);
    },
    VisitMemberInfoExpression: function VisitMemberInfoExpression(expression, context) {
        var memberName;
        if (context.wasComplex === true) context.sql += '.';
        context.sql += expression.memberName;

        if (context.isComplex == true) {
            context.complex += expression.memberName;
            context.wasComplex = true;
        } else {
            context.wasComplex = false;
            if (context.complex) memberName = context.complex + expression.memberName;else memberName = expression.memberName;

            context.complex = null;
            //context.sql += memberName;
            //context.fieldName = memberName;
            context.fieldData = { name: memberName, dataType: expression.memberDefinition.dataType };

            if (context.type == 'Projection' && !context.selectFields) context.selectFields = [{ from: memberName, dataType: expression.memberDefinition.dataType }];
        }
    },

    VisitConstantExpression: function VisitConstantExpression(expression, context) {
        if (context.type == 'Projection') _core.Guard.raise(new _core.Exception('Constant value is not supported in Projection.', 'Not supported!'));

        this.VisitQueryParameterExpression(expression, context);
    },

    VisitQueryParameterExpression: function VisitQueryParameterExpression(expression, context) {
        context.value = expression.value;
        var expressionValueType = _core.Container.resolveType(expression.type); //Container.resolveType(Container.getTypeName(expression.value));
        if (expression.value instanceof _core2.default.Queryable) {
            context.sql += '(' + expression.value.toTraceString().queryText + ')';
        } else if (this.provider.supportedDataTypes.indexOf(expressionValueType) != -1) context.sql += this.provider.fieldConverter.toDb[_core.Container.resolveName(expressionValueType)](expression.value);else {
            context.sql += "" + expression.value + "";
        }
    },

    VisitParametricQueryExpression: function VisitParametricQueryExpression(expression, context) {
        if (context.type == 'Projection') {
            this.Visit(expression.expression, context);
            if (expression.expression instanceof _core2.default.Expressions.ComplexTypeExpression) {
                context.selectFields = context.selectFields || [];
                var type = expression.expression.entityType;
                var includes = this._getComplexTypeIncludes(type);
                context.selectFields.push({ from: context.complex, type: type, includes: includes });
            }
        } else {

            var exp = this.Visit(expression.expression, context);
            context.parameters = expression.parameters;
        }
    },

    VisitEntitySetExpression: function VisitEntitySetExpression(expression, context) {
        if (context.type) {
            if (!context.complex) context.complex = '';
        } else {
            context.tableName = expression.instance.tableName;
        }
    },

    VisitObjectLiteralExpression: function VisitObjectLiteralExpression(expression, context) {
        var self = this;
        context.selectFields = context.selectFields || [];
        expression.members.forEach(function (member) {
            if (member.expression instanceof _core2.default.Expressions.ObjectLiteralExpression) {
                context.mappingPrefix = context.mappingPrefix || [];
                context.mappingPrefix.push(member.fieldName);
                self.Visit(member, context);
                context.mappingPrefix.pop();
            } else {
                if (context.selectFields.length > 0) context.sql += ', ';
                self.Visit(member, context);

                var mapping = { from: context.fieldData.name, to: context.mappingPrefix instanceof Array ? context.mappingPrefix.join('.') + '.' + member.fieldName : member.fieldName };
                if (context.selectType) {
                    mapping.type = context.selectType;
                    var includes = this._getComplexTypeIncludes(context.selectType);
                    mapping.includes = includes;
                } else {
                    mapping.dataType = context.fieldData.dataType;
                }
                context.selectFields.push(mapping);

                delete context.fieldData;
                delete context.selectType;
            }
        }, this);
    },
    VisitObjectFieldExpression: function VisitObjectFieldExpression(expression, context) {
        this.Visit(expression.expression, context);
        if (expression.expression instanceof _core2.default.Expressions.ComplexTypeExpression) {
            context.fieldData = context.fieldData || {};
            context.fieldData.name = context.complex;
            context.selectType = expression.expression.entityType;
        }
    },
    VisitEntityFieldOperationExpression: function VisitEntityFieldOperationExpression(expression, context) {
        _core.Guard.requireType("expression.operation", expression.operation, _core2.default.Expressions.MemberInfoExpression);

        var opDef = expression.operation.memberDefinition;
        var opName = opDef.mapTo || opDef.name;

        context.sql += '(';

        if (opDef.expressionInParameter == false) this.Visit(expression.source, context);

        context.sql += opName;
        var paramCounter = 0;
        var params = opDef.parameters || [];

        var args = params.map(function (item, index) {
            var result = { dataType: item.dataType, prefix: item.prefix, suffix: item.suffix };
            if (item.value) {
                result.value = item.value;
            } else if (item.name === "@expression") {
                result.value = expression.source;
            } else {
                result.value = expression.parameters[paramCounter];
                result.itemType = expression.parameters[paramCounter++].type;
            };
            return result;
        });

        args.forEach(function (arg, index) {
            var itemType = arg.itemType ? _core.Container.resolveType(arg.itemType) : null;
            if (!itemType || arg.dataType instanceof Array && arg.dataType.indexOf(itemType) != -1 || arg.dataType == itemType) {
                if (index > 0) {
                    context.sql += ", ";
                };
                var funcContext = { sql: '' };
                this.Visit(arg.value, funcContext);

                if (opName == ' LIKE ') {
                    var valueType = _core.Container.getTypeName(funcContext.value);
                    context.sql += valueType == 'string' ? "'" : "";
                    context.sql += (arg.prefix ? arg.prefix : '') + funcContext.value + (arg.suffix ? arg.suffix : '');
                    context.sql += valueType == 'string' ? "'" : "";
                } else {
                    context.sql += funcContext.sql;
                }
            } else _core.Guard.raise(new _core.Exception(itemType + " not allowed in '" + expression.operation.memberName + "' statement", "invalid operation"));
        }, this);

        if (opDef.rigthValue) context.sql += opDef.rigthValue;else context.sql += "";

        context.sql += ')';
    },

    VisitComplexTypeExpression: function VisitComplexTypeExpression(expression, context) {
        this.Visit(expression.source, context);

        context.isComplex = true;
        this.Visit(expression.selector, context);
        context.isComplex = false;

        if (context.complex != '' /*&& context.isComplex*/) context.complex += '.';
    },

    VisitEntityExpression: function VisitEntityExpression(expression, context) {
        this.Visit(expression.source, context);
    },

    _findComplexType: function _findComplexType(type, result, depth) {
        type.memberDefinitions.getPublicMappedProperties().forEach(function (memDef) {
            var dataType = _core.Container.resolveType(memDef.dataType);
            if (dataType.isAssignableTo && !dataType.isAssignableTo(_core2.default.EntitySet)) {
                var name = depth ? depth + '.' + memDef.name : memDef.name;
                result.push({ name: name, type: dataType });
                this._findComplexType(dataType, result, name);
            }
        }, this);
    },
    _getComplexTypeIncludes: function _getComplexTypeIncludes(type) {
        if (!this.cTypeCache[type.name]) {
            var inc = [];
            this._findComplexType(type, inc);
            this.cTypeCache[type.name] = inc;
        }
        return this.cTypeCache[type.name];
    }

}, null);