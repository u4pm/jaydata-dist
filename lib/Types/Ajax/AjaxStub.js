"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("../../TypeSystem/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.ajax = _index2.default.ajax || function () {
    var cfg = arguments[arguments.length - 1];
    var clb = _index2.default.PromiseHandlerBase.createCallbackSettings(cfg);
    clb.error("Not implemented");
};

exports.default = _index2.default;
module.exports = exports['default'];