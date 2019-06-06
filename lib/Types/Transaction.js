'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define('$data.Transaction', null, null, {
    constructor: function constructor() {
        this._objectId = new Date().getTime();
        _index2.default.Trace.log("create: ", this._objectId);

        this.oncomplete = new _index2.default.Event("oncomplete", this);
        this.onerror = new _index2.default.Event("onerror", this);
    },
    abort: function abort() {
        _index.Guard.raise(new _index.Exception('Not Implemented', 'Not Implemented', arguments));
    },

    _objectId: { type: _index2.default.Integer },
    transaction: { type: _index2.default.Object },

    oncomplete: { type: _index2.default.Event },
    onerror: { type: _index2.default.Event }
}, null);

exports.default = _index2.default;
module.exports = exports['default'];