'use strict';

var _core = require('../../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Class.define('$data.storageProviders.Facebook.EntitySets.Command', null, null, {
    constructor: function constructor(cfg) {
        this.Config = _core2.default.typeSystem.extend({
            CommandValue: ""
        }, cfg);
    },
    toString: function toString() {
        return this.Config.CommandValue;
    },
    Config: {}
}, {
    'to$data.Integer': function to$dataInteger(value) {
        return value;
    },
    'to$data.Number': function to$dataNumber(value) {
        return value;
    }
});

_core2.default.Class.define("$data.Facebook.FQLContext", _core2.default.EntityContext, null, {
    constructor: function constructor() {
        var friendsQuery = this.Friends.where(function (f) {
            return f.uid1 == this.me;
        }, { me: _core2.default.Facebook.FQLCommands.me }).select(function (f) {
            return f.uid2;
        });

        this.MyFriends = this.Users.where(function (u) {
            return u.uid in this.friends;
        }, { friends: friendsQuery });
    },
    Users: {
        dataType: _core2.default.EntitySet,
        tableName: 'user',
        elementType: _core2.default.Facebook.types.FbUser
    },
    Friends: {
        dataType: _core2.default.EntitySet,
        tableName: 'friend',
        elementType: _core2.default.Facebook.types.FbFriend
    },
    Pages: {
        dataType: _core2.default.EntitySet,
        tableName: 'page',
        elementType: _core2.default.Facebook.types.FbPage
    }
}, null);

_core2.default.Facebook.FQLCommands = {
    __namespace: true,
    me: new _core2.default.storageProviders.Facebook.EntitySets.Command({ CommandValue: "me()" }),
    now: new _core2.default.storageProviders.Facebook.EntitySets.Command({ CommandValue: "now()" })
};