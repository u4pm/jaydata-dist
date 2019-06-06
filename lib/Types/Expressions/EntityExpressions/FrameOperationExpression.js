'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.FrameOperationExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(source, operation, parameters) {
        this.source = source;
        this.operation = operation;
        this.parameters = parameters;

        switch (true) {
            case this.source instanceof _index2.default.Expressions.EntitySetExpression:
            case this.source instanceof _index2.default.Expressions.FrameOperationExpression:
                this.elementType = this.source.elementType;
                this.storageModel = this.source.storageModel;
                break;
        }
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.FrameOperation }

});

(0, _index.$C)('$data.Expressions.EntityFunctionOperationExpression', _index2.default.Expressions.FrameOperationExpression, null, {
    nodeType: { value: _index2.default.Expressions.ExpressionType.EntityFunctionOperation }
});

(0, _index.$C)('$data.Expressions.ContextFunctionOperationExpression', _index2.default.Expressions.FrameOperationExpression, null, {
    nodeType: { value: _index2.default.Expressions.ExpressionType.ContextFunctionOperation }
});

exports.default = _index2.default;
module.exports = exports['default'];