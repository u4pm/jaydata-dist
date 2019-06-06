'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.FilterExpression', _index2.default.Expressions.EntitySetExpression, null, {
    constructor: function constructor(source, selector) {
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///<param name="selector" type="$data.Expressions.ParametricQueryExpression" />
        ///</signature>
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///<param name="selector" type="$data.Expressions.CodeExpression" />
        ///</signature>
        this.resultType = _index2.default.Array;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.Filter, enumerable: true }
});

(0, _index.$C)('$data.Expressions.InlineCountExpression', _index2.default.Expressions.EntitySetExpression, null, {
    constructor: function constructor(source, selector) {},
    nodeType: { value: _index2.default.Expressions.ExpressionType.InlineCount, enumerable: true }
});

(0, _index.$C)('$data.Expressions.BatchExecuteQueryExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(members) {
        this.members = members;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.BatchExecuteQuery, enumerable: true }
});

(0, _index.$C)('$data.Expressions.FrameOperator', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor() {
        this.isTerminated = true;
    }
});

(0, _index.$C)('$data.Expressions.CountExpression', _index2.default.Expressions.FrameOperator, null, {
    constructor: function constructor(source) {
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///</signature>
        this.source = source;
        this.resultType = _index2.default.Integer;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.Count, enumerable: true }
});

(0, _index.$C)('$data.Expressions.SingleExpression', _index2.default.Expressions.FrameOperator, null, {
    constructor: function constructor(source) {
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///</signature>
        this.source = source;
        this.resultType = _index2.default.Object;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.Single, enumerable: true }
});

(0, _index.$C)('$data.Expressions.FindExpression', _index2.default.Expressions.FrameOperator, null, {
    constructor: function constructor(source, params, subMember) {
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///</signature>
        this.source = source;
        this.params = params;
        this.subMember = subMember;
        this.resultType = _index2.default.Object;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.Find, enumerable: true }
});

(0, _index.$C)('$data.Expressions.FirstExpression', _index2.default.Expressions.FrameOperator, null, {
    constructor: function constructor(source) {
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///</signature>
        this.source = source;
        this.resultType = _index2.default.Object;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.First, enumerable: true }
});

(0, _index.$C)('$data.Expressions.ForEachExpression', _index2.default.Expressions.FrameOperator, null, {
    constructor: function constructor(source) {
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///</signature>
        this.source = source;
        this.resultType = _index2.default.Array;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.ForEach, enumerable: true }
});
(0, _index.$C)('$data.Expressions.ToArrayExpression', _index2.default.Expressions.FrameOperator, null, {
    constructor: function constructor(source) {
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///</signature>
        this.source = source;
        this.resultType = _index2.default.Array;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.ToArray, enumerable: true }
});

(0, _index.$C)('$data.Expressions.SomeExpression', _index2.default.Expressions.FrameOperator, null, {
    constructor: function constructor(source, selector) {
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///</signature>
        this.source = source;
        this.selector = selector;
        this.resultType = _index2.default.Object;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.Some, enumerable: true }
});

(0, _index.$C)('$data.Expressions.EveryExpression', _index2.default.Expressions.FrameOperator, null, {
    constructor: function constructor(source, selector) {
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///</signature>
        this.source = source;
        this.selector = selector;
        this.resultType = _index2.default.Object;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.Every, enumerable: true }
});

(0, _index.$C)('$data.Expressions.BatchDeleteExpression', _index2.default.Expressions.FrameOperator, null, {
    constructor: function constructor(source) {
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///</signature>
        this.source = source;
        this.resultType = _index2.default.Integer;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.BatchDelete, enumerable: true }
});

exports.default = _index2.default;
module.exports = exports['default'];