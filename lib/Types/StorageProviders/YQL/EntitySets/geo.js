'use strict';

var _core = require('../../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Class.define('$data.Yahoo.types.Geo.placeTypeNameCf', _core2.default.Entity, null, {
    code: { type: 'string' },
    content: { type: 'string' }
}, null);

_core2.default.Class.define('$data.Yahoo.types.Geo.countryCf', _core2.default.Entity, null, {
    code: { type: 'string' },
    type: { type: 'string' },
    content: { type: 'string' }
}, null);

_core2.default.Class.define('$data.Yahoo.types.Geo.adminCf', _core2.default.Entity, null, {
    code: { type: 'string' },
    type: { type: 'string' },
    content: { type: 'string' }
}, null);

_core2.default.Class.define('$data.Yahoo.types.Geo.localityCf', _core2.default.Entity, null, {
    code: { type: 'string' },
    content: { type: 'string' }
}, null);

_core2.default.Class.define('$data.Yahoo.types.Geo.centroidCf', _core2.default.Entity, null, {
    latitude: { type: 'string' },
    longitude: { type: 'string' }
}, null);

_core2.default.Class.define('$data.Yahoo.types.Geo.postalCf', _core2.default.Entity, null, {
    type: { type: 'string' },
    content: { type: 'string' }
}, null);

_core2.default.Class.define('$data.Yahoo.types.Geo.boundingBoxCf', _core2.default.Entity, null, {
    southWest: { type: 'centroidRef' },
    northEast: { type: 'centroidRef' }
}, null);

_core2.default.Class.define('$data.Yahoo.types.Geo.PlaceMeta', null, null, {
    woeid: { type: 'int', key: true },
    name: { type: 'string' },
    uri: { type: 'string' },
    placeTypeName: { type: 'placeTypeNameRef' },
    lang: { type: 'string' }
}, null);

_core2.default.Class.defineEx('$data.Yahoo.types.Geo.PlaceMetaFull', [{ type: null }, { type: _core2.default.Yahoo.types.Geo.PlaceMeta }], null, {
    country: { type: 'countryRef' },
    admin1: { type: 'adminRef' },
    admin2: { type: 'adminRef' },
    admin3: { type: 'adminRef' },
    locality1: { type: 'localityRef' },
    locality2: { type: 'localityRef' },
    postal: { type: 'postalRef' },
    centroid: { type: 'centroidRef' },
    boundingBox: { type: 'boundingBoxRef' },
    areaRank: { type: 'int' },
    popRank: { type: 'int' }
}, null);

_core2.default.Class.define('$data.Yahoo.types.Geo.placetype', _core2.default.Entity, null, {
    placeTypeDescription: { type: 'string' },
    uri: { type: 'string', key: true },
    placeTypeName: { type: 'placeTypeNameRef' },
    lang: { type: 'string' }
}, null);

_core2.default.Class.defineEx('$data.Yahoo.types.Geo.sibling', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMetaFull }], null, {
    sibling_woeid: { type: 'string' }
}, null);

_core2.default.Class.defineEx('$data.Yahoo.types.Geo.parent', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMetaFull }], null, {
    child_woeid: { type: 'string' }
}, null);

_core2.default.Class.defineEx('$data.Yahoo.types.Geo.neighbor', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMetaFull }], null, {
    neighbor_woeid: { type: 'string' }
}, null);

_core2.default.Class.defineEx('$data.Yahoo.types.Geo.common', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMetaFull }], null, {
    woeid1: { type: 'string' },
    woeid2: { type: 'string' },
    woeid3: { type: 'string' },
    woeid4: { type: 'string' },
    woeid5: { type: 'string' },
    woeid6: { type: 'string' },
    woeid7: { type: 'string' },
    woeid8: { type: 'string' },
    'long': { type: 'string' }
}, null);

_core2.default.Class.defineEx('$data.Yahoo.types.Geo.children', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMetaFull }], null, {
    parent_woeid: { type: 'string' },
    placetype: { type: 'string' }
}, null);

_core2.default.Class.defineEx('$data.Yahoo.types.Geo.belongto', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMetaFull }], null, {
    member_woeid: { type: 'string' },
    placetype: { type: 'string' }
}, null);

_core2.default.Class.defineEx('$data.Yahoo.types.Geo.ancestor', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMetaFull }], null, {
    descendant_woeid: { type: 'string' }
}, null);

_core2.default.Class.defineEx('$data.Yahoo.types.Geo.place', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMetaFull }], null, {
    text: { type: 'string' },
    focus: { type: 'string' },
    placetype: { type: 'string' }
}, null);

_core2.default.Class.defineEx('$data.Yahoo.types.Geo.county', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMeta }], null, {
    place: { type: 'string' }
}, null);
_core2.default.Class.defineEx('$data.Yahoo.types.Geo.country', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMeta }], null, {
    place: { type: 'string' }
}, null);
_core2.default.Class.defineEx('$data.Yahoo.types.Geo.district', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMeta }], null, {
    place: { type: 'string' }
}, null);
_core2.default.Class.defineEx('$data.Yahoo.types.Geo.sea', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMeta }], null, {
    place: { type: 'string' }
}, null);
_core2.default.Class.defineEx('$data.Yahoo.types.Geo.state', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMeta }], null, {
    place: { type: 'string' }
}, null);
_core2.default.Class.defineEx('$data.Yahoo.types.Geo.continent', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMeta }], null, {
    place: { type: 'string' },
    view: { type: 'string' }
}, null);
_core2.default.Class.defineEx('$data.Yahoo.types.Geo.ocean', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMeta }], null, {
    place: { type: 'string' },
    view: { type: 'string' }
}, null);
_core2.default.Class.defineEx('$data.Yahoo.types.Geo.descendant', [{ type: _core2.default.Entity }, { type: _core2.default.Yahoo.types.Geo.PlaceMeta }], null, {
    ancestor_woeid: { type: 'string' },
    placetype: { type: 'string' },
    degree: { type: 'string' },
    view: { type: 'string' }
}, null);

_core.Container.registerType('placeTypeNameRef', _core2.default.Yahoo.types.Geo.placeTypeNameCf);
_core.Container.registerType('centroidRef', _core2.default.Yahoo.types.Geo.centroidCf);
_core.Container.registerType('countryRef', _core2.default.Yahoo.types.Geo.countryCf);
_core.Container.registerType('adminRef', _core2.default.Yahoo.types.Geo.adminCf);
_core.Container.registerType('localityRef', _core2.default.Yahoo.types.Geo.localityCf);
_core.Container.registerType('postalRef', _core2.default.Yahoo.types.Geo.postalCf);
_core.Container.registerType('boundingBoxRef', _core2.default.Yahoo.types.Geo.boundingBoxCf);