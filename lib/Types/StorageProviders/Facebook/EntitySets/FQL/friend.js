"use strict";

var _core = require("jaydata/core");

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Class.define("$data.Facebook.types.FbFriend", _core2.default.Entity, null, {
    uid1: { type: "number", key: true, searchable: true },
    uid2: { type: "number", key: true, searchable: true }
}, null);