'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.$C)('$data.queryBuilder', null, null, {
    constructor: function constructor() {
        this._fragments = {};
        this.selectedFragment = null;
        this._binderConfig = {};
        this.modelBinderConfig = this._binderConfig;
        this._binderConfigPropertyStack = [];
    },
    selectTextPart: function selectTextPart(name) {
        if (!this._fragments[name]) {
            this._fragments[name] = { text: '', params: [] };
        }
        this.selectedFragment = this._fragments[name];
    },
    getTextPart: function getTextPart(name) {
        return this._fragments[name];
    },
    addText: function addText(textParticle) {
        this.selectedFragment.text += textParticle;
    },
    addParameter: function addParameter(param) {
        this.selectedFragment.params.push(param);
    },
    selectModelBinderProperty: function selectModelBinderProperty(name) {
        this._binderConfigPropertyStack.push(this.modelBinderConfig);
        if (!(name in this.modelBinderConfig)) {
            this.modelBinderConfig[name] = {};
        }
        this.modelBinderConfig = this.modelBinderConfig[name];
    },
    popModelBinderProperty: function popModelBinderProperty() {
        if (this._binderConfigPropertyStack.length === 0) {
            this.modelBinderConfig = this._binderConfig();
        } else {
            this.modelBinderConfig = this._binderConfigPropertyStack.pop();
        }
    },
    resetModelBinderProperty: function resetModelBinderProperty(name) {
        this._binderConfigPropertyStack = [];
        this.modelBinderConfig = this._binderConfig;
    },
    addKeyField: function addKeyField(name) {
        if (!this.modelBinderConfig['$keys']) {
            this.modelBinderConfig['$keys'] = new Array();
        }
        this.modelBinderConfig['$keys'].push(name);
    }
});

exports.default = _index2.default;
module.exports = exports['default'];