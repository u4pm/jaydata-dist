'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.EntityFieldExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(source, selector) {
        ///<param name="source" type="$data.Entity.EntityExpression" />
        ///<param name="selector" type="$data.Entity.MemberInfoExpression" />
        this.selector = selector;
        this.source = source;

        if (this.selector instanceof _index2.default.Expressions.MemberInfoExpression || this.selector.name) {
            this.memberName = this.selector.name;
        }
    },

    nodeType: { value: _index2.default.Expressions.ExpressionType.EntityField }
});

exports.default = _index2.default;
module.exports = exports['default'];