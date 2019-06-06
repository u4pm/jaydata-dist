'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

var _jaydataDynamicMetadata = require('jaydata-dynamic-metadata');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Annotations = _jaydataDynamicMetadata.Annotations;
_index2.default.Metadata = _jaydataDynamicMetadata.Metadata;

_index2.default.DynamicMetadata = _jaydataDynamicMetadata.DynamicMetadata;
var dynamicMetadata = new _jaydataDynamicMetadata.DynamicMetadata(_index2.default);
_index2.default.service = dynamicMetadata.service.bind(dynamicMetadata);
_index2.default.initService = dynamicMetadata.initService.bind(dynamicMetadata);
_index2.default.odatajs = _jaydataDynamicMetadata.odatajs;

exports.default = _index2.default;
module.exports = exports['default'];