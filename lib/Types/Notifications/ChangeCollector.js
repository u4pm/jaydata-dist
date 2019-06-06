'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require('../../TypeSystem/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.Class.define('$data.Notifications.ChangeCollector', _index2.default.Notifications.ChangeCollectorBase, null, {
    buildData: function buildData(entities) {
        var result = [];
        entities.forEach(function (element) {
            var resObj = { entityState: element.data.entityState, typeName: element.data.getType().name };
            var enumerableMemDefCollection = [];

            switch (element.data.entityState) {
                case _index2.default.EntityState.Added:
                    enumerableMemDefCollection = element.data.getType().memberDefinitions.getPublicMappedProperties();
                    break;
                case _index2.default.EntityState.Modified:
                    enumerableMemDefCollection = element.data.changedProperties;
                    break;
                case _index2.default.EntityState.Deleted:
                    enumerableMemDefCollection = element.data.getType().memberDefinitions.getKeyProperties();
                    break;
                default:
                    break;
            }

            enumerableMemDefCollection.forEach(function (memDef) {
                resObj[memDef.name] = element.data[memDef.name];
            });

            result.push(resObj);
        });

        return result;
    }
}, null);

exports.default = _index2.default;
module.exports = exports['default'];