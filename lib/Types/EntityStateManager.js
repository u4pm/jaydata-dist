'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define('$data.EntityStateManager', null, null, {
    constructor: function constructor(entityContext) {
        this.entityContext = null;
        this.trackedEntities = [];
        this.init(entityContext);
    },
    init: function init(entityContext) {
        this.entityContext = entityContext;
    },
    reset: function reset() {
        this.trackedEntities = [];
    }
}, null);

exports.default = _index2.default;
module.exports = exports['default'];