'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.Expressions.EntityExpression', _index2.default.Expressions.ExpressionNode, null, {
    constructor: function constructor(source, selector) {
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///<param name="selector" type="$data.Expressions.MemberInfoExpression" />
        ///</signature>
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///<param name="selector" type="$data.Expressions.IndexingExpression" />
        ///</signature>
        ///<signature>
        ///<param name="source" type="$data.Expressions.EntitySetExpression" />
        ///<param name="selector" type="$data.Expressions.AccessorExpression" />
        ///</signature>
        _index.Guard.requireValue("source", source);
        _index.Guard.requireValue("selector", selector);
        if (!(source instanceof _index2.default.Expressions.EntitySetExpression) && !(source instanceof _index2.default.Expressions.ServiceOperationExpression)) {
            _index.Guard.raise("Only EntitySetExpressions can be the source for an EntityExpression");
        }

        this.source = source;
        this.selector = selector;

        this.entityType = this.source.elementType;
        this.storageModel = this.source.storageModel;

        _index.Guard.requireValue("entityType", this.entityType);
        _index.Guard.requireValue("storageModel", this.storageModel);
    },

    getMemberDefinition: function getMemberDefinition(name) {
        var memdef = this.entityType.getMemberDefinition(name);
        if (!memdef) {
            var findMember = function findMember(type) {
                if (type.inheritedTo) {
                    for (var i = 0; i < type.inheritedTo.length; i++) {
                        memdef = type.inheritedTo[i].getMemberDefinition(name);
                        if (!memdef) findMember(type.inheritedTo[i]);else break;
                    }
                }
            };
            findMember(this.entityType);
            if (!memdef) {
                _index.Guard.raise(new _index.Exception("Unknown member " + name + " on type " + this.entityType.name, "MemberNotFound"));
            }
        };
        memdef.storageModel = this.storageModel;
        return memdef;
    },

    nodeType: { value: _index2.default.Expressions.ExpressionType.Entity }
});

exports.default = _index2.default;
module.exports = exports['default'];