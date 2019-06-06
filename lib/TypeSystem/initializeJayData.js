'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _initializeJayDataClient = require('./initializeJayDataClient.js');

var _initializeJayDataClient2 = _interopRequireDefault(_initializeJayDataClient);

var _acorn = require('acorn');

var acorn = _interopRequireWildcard(_acorn);

var _package = require('../../package.json');

var pkg = _interopRequireWildcard(_package);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof console === 'undefined') {
  console = {
    warn: function warn() {},
    error: function error() {},
    log: function log() {},
    dir: function dir() {},
    time: function time() {},
    timeEnd: function timeEnd() {}
  };
}

if (!console.warn) console.warn = function () {};
if (!console.error) console.error = function () {};

(function ($data) {
  ///<summary>
  /// Collection of JayData services
  ///</summary>
  $data.__namespace = true;
  $data.version = "JayData " + pkg.version;
  $data.versionNumber = pkg.version;
  $data.root = {};
  $data.Acorn = acorn;
})(_initializeJayDataClient2.default);
exports.default = _initializeJayDataClient2.default;
// Do not remove this block, it is used by jsdoc
/**
    @name $data.Base
    @class base class
*/

module.exports = exports['default'];