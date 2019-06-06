'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.QueryParameterExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(name, index, value, type) {
        this.name = name;
        this.index = index;
        this.value = value;
        //TODO
        this.type = _index.Container.getTypeName(value);
    },

    nodeType: { value: _index2.default.Expressions.ExpressionType.QueryParameter, writable: false }
});

exports.default = _index2.default;
module.exports = exports['default'];