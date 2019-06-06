'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.EntityContextExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(instance) {
        ///<param name="instance" type="$data.EntityContext" />
        //Object.defineProperty(this, "instance", { value: instance, enumerable: false });
        this.instance = instance;
        //this.storage_type = {};
        //this.typeName = this.type.name;
    },
    instance: { enumerable: false },
    nodeType: { value: _index2.default.Expressions.ExpressionType.EntityContext, enumerable: true }

});

exports.default = _index2.default;
module.exports = exports['default'];