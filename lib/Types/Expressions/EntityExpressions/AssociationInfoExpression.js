'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.AssociationInfoExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(associationInfo) {
        this.associationInfo = associationInfo;
    },
    nodeType: { value: _index2.default.Expressions.ExpressionType.AssociationInfo, enumerable: true }
});

exports.default = _index2.default;
module.exports = exports['default'];