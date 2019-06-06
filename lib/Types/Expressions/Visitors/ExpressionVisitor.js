'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.ExpressionVisitor', null, null, {
    constructor: function constructor() {
        this._deep = 0;
    },

    Visit: function Visit(eNode, context) {
        ///<summary></summary>
        ///<param name="eNode" type="$data.Expressions.ExpressionNode"/>
        ///<param name="context" type="Object"/>
        //<return type="$data.Expressions.ExpressionNode"/>

        //this._deep = this._deep + 1;
        if (!eNode) {
            return eNode;
        }

        var result = null;

        switch (eNode.expressionType) {
            case _index2.default.Expressions.ParameterExpression:
                result = this.VisitParameter(eNode, context);
                break;
            case _index2.default.Expressions.ConstantExpression:
                result = this.VisitConstant(eNode, context);
                break;
            case _index2.default.Expressions.FunctionExpression:
                result = this.VisitFunction(eNode, context);
                break;
            case _index2.default.Expressions.CallExpression:
                result = this.VisitCall(eNode, context);
                break;
            case _index2.default.Expressions.SimpleBinaryExpression:
                result = this.VisitBinary(eNode, context);
                break;
            case _index2.default.Expressions.PropertyExpression:
                result = this.VisitProperty(eNode, context);
                break;
            //result = th
            case _index2.default.Expressions.ThisExpression:
                if (_index2.default.defaults.parameterResolutionCompatibility) {
                    result = this.VisitThis(eNode, context);
                } else {
                    _index.Guard.raise("Keyword 'this' is not allowed. You should get value from parameter. (it, p1) => it.Title == p1");
                }
                break;
            case _index2.default.Expressions.ObjectLiteralExpression:
                result = this.VisitObjectLiteral(eNode, context);
                break;
            case _index2.default.Expressions.ObjectFieldExpression:
                result = this.VisitObjectField(eNode, context);
                break;
            case _index2.default.Expressions.ArrayLiteralExpression:
                result = this.VisitArrayLiteral(eNode, context);
                break;
            case _index2.default.Expressions.UnaryExpression:
                result = this.VisitUnary(eNode, context);
                break;
            case _index2.default.Expressions.EntityContextExpression:
                result = this.VisitEntityContext(eNode, context);
                break;
            default:
                debugger;
                break;
            //case VARIABLE:

            //    result = this.VisitVariable(eNode, context);
            //    break;
            //case MEMBERACCESS:
            //    result = this.VisitMember(eNode, context);
            //    break;
            //case BINARY:
            //    result = this.VisitBinary(eNode, context);
            //    break;
            //case UNARY:
            //    result = this.VisitUnary(eNode, context);
            //    break;
            //case INCDEC:
            //    result = this.VisitIncDec(eNode, context);
            //    break;
            //case EQUALITY: result = this.VisitEquality(eNode, context); break;
            //case DECISION: result = this.VisitDecision(eNode, context); break;
            //case METHODCALL: result = this.VisitMethodCall(eNode, context); break;
            //case NEW: result = this.VisitNew(eNode, context); break;
            //case JSONASSIGN: result = this.VisitJsonAssign(eNode, context); break;
            //case ARRAYACCESS: result = this.VisitArrayAccess(eNode, context); break;
            //default:
            //    Guard.raise("Type isn't implemented: " + eNode.type);
        }

        this._deep = this._deep - 1;
        return result;
    },

    VisitArrayLiteral: function VisitArrayLiteral(eNode, context) {
        ///<param name="eNode" type="$data.Expressions.ArrayLiteralExpression" />
        var self = this;
        var items = eNode.items.map(function (item) {
            return self.Visit(item, context);
        });
        var result = _index.Container.createArrayLiteralExpression(items);
        return result;
    },

    VisitObjectLiteral: function VisitObjectLiteral(eNode, context) {
        ///<param name="eNode" type="$data.Expressions.ObjectLiteralExpression" />
        var self = this;
        var members = eNode.members.map(function (member) {
            return self.Visit(member, context);
        });
        var result = _index.Container.createObjectLiteralExpression(members);
        return result;
    },

    VisitObjectField: function VisitObjectField(eNode, context) {
        ///<param name="eNode" type="$data.Expressions.ObjectLiteralExpression" />
        var expression = this.Visit(eNode.expression, context);
        var result = _index.Container.createObjectFieldExpression(eNode.fieldName, expression);
        return result;
    },

    VisitThis: function VisitThis(eNode, context) {
        return eNode;
    },
    VisitCall: function VisitCall(eNode, context) {
        ///<param name="eNode" type="$data.Expressions.CallExpression" />
        var self = this;
        var args = eNode.args.map(function (arg) {
            return this.Visit(arg, context);
        }, this);
        var expression = this.Visit(eNode.expression, context);
        var member = this.Visit(eNode.member, context);
        return new _index2.default.Expressions.CallExpression(expression, member, args);
    },

    VisitParameter: function VisitParameter(eNode, context) {
        ///<param name="eNode" type="$data.Expressions.ParameterExpression" />
        ///<returns type="$data.Expressions.ParameterExpression" />
        //var result  = new $data.Expressions.ParameterExpression(eNode.name, eNode.type, eNode.nodeType);
        return eNode;
    },

    VisitConstant: function VisitConstant(eNode, context) {
        ///<param name="eNode" type="$data.Expressions.ParameterExpression" />
        ///<returns type="$data.Expressions.ParameterExpression" />
        //var result  = new $data.Expressions.ParameterExpression(eNode.name, eNode.type, eNode.nodeType);
        return eNode;
    },

    VisitFunction: function VisitFunction(eNode, context) {
        ///<param name="eNode" type="$data.Expressions.FunctionExpression" />
        var self = this;

        var params = eNode.parameters.map(function (p, i) {
            return self.Visit(p, context);
        });

        var body = self.Visit(eNode.body, context);
        var result = new _index2.default.Expressions.FunctionExpression(eNode.name, params, body);
        return result;
    },

    VisitBinary: function VisitBinary(eNode, context) {
        ///<summary></summary>
        ///<param name="eNode" type="$data.Expressions.SimpleBinaryExpression"/>
        ///<param name="context" type="Object"/>
        //<return type="$data.Expressions.ExpressionNodeTypes.BinaryExpressionNode"/>

        var left = this.Visit(eNode.left, context);
        var right = this.Visit(eNode.right, context);
        return new _index2.default.Expressions.SimpleBinaryExpression(left, right, eNode.nodeType, eNode.operator, eNode.type);
    },

    VisitProperty: function VisitProperty(eNode, context) {
        ///<param name="eNode" type="$data.Expressions.PropertyExpression" />
        var expression = this.Visit(eNode.expression, context);
        var member = this.Visit(eNode.member, context);
        return new _index2.default.Expressions.PropertyExpression(expression, member);
        //var member =
    },

    VisitUnary: function VisitUnary(eNode, context) {
        ///<summary></summary>
        ///<param name="eNode" type="$data.Expressions.UnaryExpression"/>
        ///<param name="context" type="Object"/>
        ///<returns type="$data.Expressions.UnaryExpression"/>
        var operand = this.Visit(eNode.operand, context);
        if (operand === eNode.operand) return eNode;
        return new _index2.default.Expressions.UnaryExpression(operand, eNode.operator, eNode.nodeType);
    },

    VisitEntityContext: function VisitEntityContext(eNode, context) {
        ///<param name="eNode" type="$data.Expressions.ParameterExpression" />
        ///<returns type="$data.Expressions.EntityContextExpression" />
        //var result  = new $data.Expressions.ParameterExpression(eNode.name, eNode.type, eNode.nodeType);
        return eNode;
    },

    VisitDecision: function VisitDecision(eNode, context) {
        ///<summary></summary>
        ///<param name="eNode" type="$data.Expressions.ExpressionNodeTypes.DecisionExpressionNode"/>
        ///<param name="context" type="Object"/>
        //<return type="$data.Expressions.ExpressionNodeTypes.DecisionExpressionNode"/>

        var expression = this.Visit(eNode.expression, context);
        var left = this.Visit(eNode.left, context);
        var right = this.Visit(eNode.right, context);
        if (expression === eNode.expression && left === eNode.left && right === eNode.right) return eNode;
        return _index2.default.Expressions.ExpressionNodeTypes.DecisionExpressionNode.create(eNode.executable, expression, left, right);
    },

    VisitNew: function VisitNew(eNode, context) {
        ///<summary></summary>
        ///<param name="eNode" type="$data.Expressions.ExpressionNodeTypes.NewExpressionNode"/>
        ///<param name="context" type="Object"/>
        //<return type="$data.Expressions.ExpressionNodeTypes.NewExpressionNode"/>

        var values = this.VisitArray(eNode.values, context);
        if (values === eNode.values) return eNode;
        return _index2.default.Expressions.ExpressionNodeTypes.NewExpressionNode.create(true, values);
    },
    VisitArrayAccess: function VisitArrayAccess(eNode, context) {
        ///<summary></summary>
        ///<param name="eNode" type="$data.Expressions.ExpressionNodeTypes.ArrayAccessExpressionNode"/>
        ///<param name="context" type="Object"/>
        //<return type="$data.Expressions.ExpressionNodeTypes.ArrayAccessExpressionNode"/>

        var array = this.Visit(eNode.array, context);
        var index = this.Visit(eNode.index, context);
        if (array === eNode.array && index === eNode.index) return eNode;
        return _index2.default.Expressions.ExpressionNodeTypes.ArrayAccessExpressionNode.create(true, array, index);
    },
    VisitArray: function VisitArray(eNodes, context) {
        var args = [];
        var ok = true;
        for (var i = 0; i < eNodes.length; i++) {
            args[i] = this.Visit(eNodes[i], context);
            ok = ok && args[i] === eNodes[i];
        }
        return ok ? eNodes : args;
    },
    GetMemberChain: function GetMemberChain(memberAccess, context) {
        // { type:MEMBERACCESS, executable:true, expression:, member: }
        if (memberAccess.expression.type == MEMBERACCESS) {
            var a = this.GetMemberChain(memberAccess.expression, context);
            a.push(memberAccess.member);
            return a;
        }
        return [memberAccess.expression, memberAccess.member];
    }
}, {});

exports.default = _index2.default;
module.exports = exports['default'];