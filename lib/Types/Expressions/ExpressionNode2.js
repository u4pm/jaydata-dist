"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("../../TypeSystem/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//TODO: Finish refactoring ExpressionNode.js

_index2.default.Class.define("$data.Expressions.ExpressionType", null, null, {}, {
    Constant: "constant", // { type:LITERAL, executable:true, valueType:, value: }
    Variable: "variable", // { type:VARIABLE, executable:true, name: }
    MemberAccess: "memberAccess", // { type:MEMBERACCESS, executable:true, expression:, member: }
    Call: "call",

    /* binary operators */
    Equal: "equal",
    NotEqual: "notEqual",
    EqualTyped: "equalTyped",
    NotEqualTyped: "notEqualTyped",
    GreaterThen: "greaterThan",
    LessThen: "lessThan",
    GreaterThenOrEqual: "greaterThanOrEqual",
    LessThenOrEqual: "lessThenOrEqual",
    Or: "or",
    OrBitwise: "orBitwise",
    And: "and",
    AndBitwise: "andBitwise",

    In: "in",

    Add: "add",
    Divide: "divide",
    Multiply: "multiply",
    Subtract: "subtract",
    Modulo: "modulo",
    ArrayIndex: "arrayIndex",

    /* unary operators */
    New: "new",
    Positive: "positive",
    Negative: "negative",
    Increment: "increment",
    Decrement: "decrement",
    Not: "not",

    This: "this",
    LambdaParameterReference: "lambdaParameterReference",
    LambdaParameter: "lambdaParameter",
    ParameterReference: "parameterReference",
    Parameter: "parameter",

    ArrayLiteral: "arrayLiteral",
    ObjectLiteral: "objectLiteral",
    ObjectField: "objectField",
    Function: "Function",
    Unknown: "UNKNOWN",

    EntitySet: "EntitySet",
    ServiceOperation: "ServiceOperation",
    EntityField: "EntityField",
    EntityContext: "EntityContext",
    Entity: "Entity",
    Filter: "Filter",
    First: "First",
    Count: "Count",
    InlineCount: "InlineCount",
    BatchExecuteQuery: "BatchExecuteQuery",
    Single: "Single",
    Find: "Find",
    Some: "Some",
    Every: "Every",
    ToArray: "ToArray",
    BatchDelete: "BatchDelete",
    ForEach: "ForEach",
    Projection: "Projection",
    EntityMember: "EntityMember",
    EntityFieldOperation: "EntityFieldOperation",
    FrameOperation: "FrameOperation",
    EntityFunctionOperation: "EntityFunctionOperation",
    ContextFunctionOperation: "ContextFunctionOperation",
    EntityBinary: "EntityBinary",
    Code: "Code",
    ParametricQuery: "ParametricQuery",
    MemberInfo: "MemberInfo",
    QueryParameter: "QueryParameter",
    ComplexEntityField: "ComplexEntityField",
    Distinct: "Distinct",
    Take: "Take",
    Skip: "Skip",
    OrderBy: "OrderBy",
    OrderByDescending: "OrderByDescending",
    GroupBy: "GroupBy",
    Include: "Include",

    IndexedPhysicalAnd: "IndexedDBPhysicalAndFilterExpression",
    IndexedLogicalAnd: "IndexedDBLogicalAndFilterExpression",
    IndexedLogicalOr: "IndexedDBLogicalOrFilterExpression",
    IndexedLogicalIn: "IndexedDBLogicalInFilterExpression"
});

_index2.default.BinaryOperator = function () {
    ///<field name="operator" type="string" />
    ///<field name="expressionType" type="$data.ExpressionType" />
    ///<field name="type" type="string" />
};

_index2.default.binaryOperators = [{ operator: "==", expressionType: _index2.default.Expressions.ExpressionType.Equal, type: "boolean", implementation: function implementation(a, b) {
        return a == b;
    } }, { operator: "===", expressionType: _index2.default.Expressions.ExpressionType.EqualTyped, type: "boolean", implementation: function implementation(a, b) {
        return a === b;
    } }, { operator: "!=", expressionType: _index2.default.Expressions.ExpressionType.NotEqual, type: "boolean", implementation: function implementation(a, b) {
        return a != b;
    } }, { operator: "!==", expressionType: _index2.default.Expressions.ExpressionType.NotEqualTyped, type: "boolean", implementation: function implementation(a, b) {
        return a !== b;
    } }, { operator: ">", expressionType: _index2.default.Expressions.ExpressionType.GreaterThen, type: "boolean", implementation: function implementation(a, b) {
        return a > b;
    } }, { operator: ">=", expressionType: _index2.default.Expressions.ExpressionType.GreaterThenOrEqual, type: "boolean", implementation: function implementation(a, b) {
        return a >= b;
    } }, { operator: "<=", expressionType: _index2.default.Expressions.ExpressionType.LessThenOrEqual, type: "boolean", implementation: function implementation(a, b) {
        return a <= b;
    } }, { operator: "<", expressionType: _index2.default.Expressions.ExpressionType.LessThen, type: "boolean", implementation: function implementation(a, b) {
        return a < b;
    } }, { operator: "&&", expressionType: _index2.default.Expressions.ExpressionType.And, type: "boolean", implementation: function implementation(a, b) {
        return a && b;
    } }, { operator: "||", expressionType: _index2.default.Expressions.ExpressionType.Or, type: "boolean", implementation: function implementation(a, b) {
        return a || b;
    } }, { operator: "&", expressionType: _index2.default.Expressions.ExpressionType.AndBitwise, type: "number", implementation: function implementation(a, b) {
        return a & b;
    } }, { operator: "|", expressionType: _index2.default.Expressions.ExpressionType.OrBitwise, type: "number", implementation: function implementation(a, b) {
        return a | b;
    } }, { operator: "+", expressionType: _index2.default.Expressions.ExpressionType.Add, type: "number", implementation: function implementation(a, b) {
        return a + b;
    } }, { operator: "-", expressionType: _index2.default.Expressions.ExpressionType.Subtract, type: "number", implementation: function implementation(a, b) {
        return a - b;
    } }, { operator: "/", expressionType: _index2.default.Expressions.ExpressionType.Divide, type: "number", implementation: function implementation(a, b) {
        return a / b;
    } }, { operator: "%", expressionType: _index2.default.Expressions.ExpressionType.Modulo, type: "number", implementation: function implementation(a, b) {
        return a % b;
    } }, { operator: "*", expressionType: _index2.default.Expressions.ExpressionType.Multiply, type: "number", implementation: function implementation(a, b) {
        return a * b;
    } }, { operator: "[", expressionType: _index2.default.Expressions.ExpressionType.ArrayIndex, type: "number", implementation: function implementation(a, b) {
        return a[b];
    } }, { operator: "in", expressionType: _index2.default.Expressions.ExpressionType.In, type: 'boolean', implementation: function implementation(a, b) {
        return a in b;
    } }];

_index2.default.binaryOperators.resolve = function (operator) {
    var result = _index2.default.binaryOperators.filter(function (item) {
        return item.operator == operator;
    });
    if (result.length > 0) return operator;
    //Guard.raise("Unknown operator: " + operator);
};

_index2.default.binaryOperators.contains = function (operator) {
    return _index2.default.binaryOperators.some(function (item) {
        return item.operator == operator;
    });
};

_index2.default.binaryOperators.getOperator = function (operator) {
    ///<returns type="BinaryOperator" />
    var result = _index2.default.binaryOperators.filter(function (item) {
        return item.operator == operator;
    });
    if (result.length < 1) _index.Guard.raise("Unknown operator: " + operator);
    return result[0];
};

_index2.default.unaryOperators = [{ operator: "+", arity: "prefix", expressionType: _index2.default.Expressions.ExpressionType.Positive, type: "number", implementation: function implementation(operand) {
        return +operand;
    } }, { operator: "-", arity: "prefix", expressionType: _index2.default.Expressions.ExpressionType.Negative, type: "number", implementation: function implementation(operand) {
        return -operand;
    } }, { operator: "++", arity: "prefix", expressionType: _index2.default.Expressions.ExpressionType.Increment, type: "number", implementation: function implementation(operand) {
        return ++operand;
    } }, { operator: "--", arity: "prefix", expressionType: _index2.default.Expressions.ExpressionType.Decrement, type: "number", implementation: function implementation(operand) {
        return --operand;
    } }, { operator: "++", arity: "suffix", expressionType: _index2.default.Expressions.ExpressionType.Increment, type: "number", implementation: function implementation(operand) {
        return operand++;
    } }, { operator: "!", arity: "prefix", expressionType: _index2.default.Expressions.ExpressionType.Not, type: "boolean", implementation: function implementation(operand) {
        return !operand;
    } }, { operator: "--", arity: "suffix", expressionType: _index2.default.Expressions.ExpressionType.Decrement, type: "number", implementation: function implementation(operand) {
        return operand--;
    }

    //{ operator: "new", expressionType : $data.Expressions.ExpressionType.New, type: "object", implementation: function(operand) { return new operand; }
}];

_index2.default.unaryOperators.resolve = function (operator) {
    var result = _index2.default.unaryOperators.filter(function (item) {
        return item.operator == operator;
    });
    if (result.length > 0) return operator;
    //Guard.raise("Unknown operator: " + operator);
};

_index2.default.unaryOperators.contains = function (operator) {
    return _index2.default.unaryOperators.some(function (item) {
        return item.operator == operator;
    });
};

_index2.default.unaryOperators.getOperator = function (operator, arity) {
    ///<returns type="BinaryOperator" />
    var result = _index2.default.unaryOperators.filter(function (item) {
        return item.operator == operator && (!arity || item.arity == arity);
    });
    if (result.length < 1) _index.Guard.raise("Unknown operator: " + operator);
    return result[0];
};

_index2.default.timeIt = function (fn, iterations) {
    iterations = iterations || 1;

    console.time("!");
    for (var i = 0; i < iterations; i++) {
        fn();
    }
    console.timeEnd("!");
};

_index2.default.Expressions.OperatorTypes = {
    UNARY: "UNARY", // { type:UNARY, executable:true, operator:, operand: }
    INCDEC: "INCDEC", // { type:INCDEC, executable:true, operator:, operand:, suffix: }
    DECISION: "DECISION", // { type:DECISION, executable:true, expression:, left:, right: }
    METHODCALL: "METHODCALL", // { type:METHODCALL, executable:true, object:, method:, args: }
    NEW: "NEW", // { type:NEW, executable:true, values: [] };
    JSONASSIGN: "JSONASSIGN", // { type:JSONASSIGN, executable:true, left:, right: }
    ARRAYACCESS: "ARRAYACCESS", // { type:ARRAYACCESS, executable:true, array:, index: }
    UNKNOWN: "UNKNOWN"
};

_index2.default.executable = true;

function jsonify(obj) {
    return JSON.stringify(obj, null, "\t");
}

(0, _index.$C)('$data.Expressions.ExpressionNode', null, null, {
    constructor: function constructor() {
        ///<summary>Provides a base class for all Expressions.</summary>
        ///<field name="nodeType" type="string">Represents the expression type of the node&#10;
        ///For the list of expression node types refer to $data.Expressions.ExpressionType
        ///</field>
        ///<field name="type" type="Function">The result type of the expression</field>
        ///<field name="executable" type="boolean">True if the expression can be evaluated to yield a result</field>
        ///this.nodeType = $data.Expressions.ExpressionType.Unknown;
        ///this.type = type;
        ///this.nodeType = $data.Expressions.ExpressionType.Unknown;
        ///this.executable = (executable === undefined || executable === null) ? true : executable;
        ///TODO
        this.expressionType = this.constructor;
    },
    toJSON: function toJSON() {
        var __proto__ = (0, _index2.default)('$data.Expressions.ExpressionNode').prototype;
        var origToJSON = __proto__.toJSON;
        delete __proto__.toJSON;
        var res = JSON.parse(JSON.stringify(this));
        res.expressionType = _index.Container.resolveName(this._expressionType);
        __proto__.toJSON = origToJSON;
        return res;
    },
    getJSON: function getJSON() {
        return jsonify(this);
    },

    //TOBLOG maybe
    /*expressionType: {
        value: undefined,
        ////OPTIMIZE
        set: function (value) {
            var _expressionType;
            Object.defineProperty(this, "expressionType", {
                set: function (value) {
                    if (typeof value === 'string') {
                        value = Container.resolveType(value);
                    }
                    _expressionType = value;
                },
                get: function (value) {
                    //IE ommits listing JSON.stringify in call chain
                          if (arguments.callee.caller == jsonify || arguments.callee.caller == JSON.stringify) {
                        return Container.resolveName(_expressionType);
                    }
                    return _expressionType;
                },
                enumerable: true
            });
              this.expressionType = value;
        },
        get: function () { return undefined; },
        enumerable: true
    },*/
    expressionType: {
        set: function set(value) {
            if (typeof value === 'string') {
                value = _index.Container.resolveType(value);
            }
            this._expressionType = value;
        },
        get: function get(value) {
            //IE ommits listing JSON.stringify in call chain

            // if (arguments.callee.caller == jsonify || arguments.callee.caller == JSON.stringify) {
            //     return Container.resolveName(this._expressionType);
            // }
            return this._expressionType;
        },
        enumerable: true
    },
    ///toString: function () { },
    nodeType: { value: _index2.default.Expressions.ExpressionType.Unknown, writable: false },

    type: {},

    isTerminated: { value: false },

    toString: function toString() {
        return this.value;
    }
}, null);

(0, _index.$C)('$data.Expressions.UnaryExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(operand, operator, nodeType, resolution) {
        /// <summary>
        /// Represents an operation with only one operand and an operator
        /// </summary>
        /// <param name="operand"></param>
        /// <param name="operator"></param>
        /// <param name="nodeType"></param>
        /// <param name="resolution"></param>
        this.operand = operand;
        this.operator = operator;
        this.nodeType = nodeType;
        this.resolution = resolution;
    },

    operator: { value: undefined, writable: true },
    operand: { value: undefined, writable: true },
    nodeType: { value: undefined, writable: true }
});

exports.default = _index2.default;
module.exports = exports['default'];