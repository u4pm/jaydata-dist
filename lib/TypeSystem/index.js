'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Container = exports.$C = exports.Exception = exports.Guard = undefined;

var _TypeSystem = require('./TypeSystem.js');

var _TypeSystem2 = _interopRequireDefault(_TypeSystem);

var _Types = require('./Types/Types.js');

var _Types2 = _interopRequireDefault(_Types);

var _Trace = require('./Trace/Trace.js');

var _Trace2 = _interopRequireDefault(_Trace);

var _Logger = require('./Trace/Logger.js');

var _Logger2 = _interopRequireDefault(_Logger);

var _SimpleBase = require('./Types/SimpleBase.js');

var _SimpleBase2 = _interopRequireDefault(_SimpleBase);

var _Geospatial = require('./Types/Geospatial.js');

var _Geospatial2 = _interopRequireDefault(_Geospatial);

var _Geography = require('./Types/Geography.js');

var _Geography2 = _interopRequireDefault(_Geography);

var _Geometry = require('./Types/Geometry.js');

var _Geometry2 = _interopRequireDefault(_Geometry);

var _Guid = require('./Types/Guid.js');

var _Guid2 = _interopRequireDefault(_Guid);

var _Blob = require('./Types/Blob.js');

var _Blob2 = _interopRequireDefault(_Blob);

var _EdmTypes = require('./Types/EdmTypes.js');

var _EdmTypes2 = _interopRequireDefault(_EdmTypes);

var _Converter = require('./Types/Converter.js');

var _Converter2 = _interopRequireDefault(_Converter);

var _jaydataErrorHandler = require('jaydata-error-handler');

var _jaydataPromiseHandler = require('jaydata-promise-handler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jaydataPromiseHandler.PromiseHandler.use(_TypeSystem2.default);

var Guard = exports.Guard = _jaydataErrorHandler.Guard;
_TypeSystem2.default.Guard = _jaydataErrorHandler.Guard;

var Exception = exports.Exception = _jaydataErrorHandler.Exception;
_TypeSystem2.default.Exception = _jaydataErrorHandler.Exception;

var $C = exports.$C = _TypeSystem.$C;
_TypeSystem2.default.$C = _TypeSystem.$C;

var Container = exports.Container = _TypeSystem.Container;
exports.default = _TypeSystem2.default;