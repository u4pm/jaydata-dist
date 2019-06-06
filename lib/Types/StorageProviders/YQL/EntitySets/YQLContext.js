'use strict';

var _core = require('../../../../../core.js');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_core2.default.Class.define("$data.Yahoo.YQLContext", _core2.default.EntityContext, null, {
    //Geo
    Continents: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.continent, tableName: 'geo.continents' },
    Counties: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.county, tableName: 'geo.counties' },
    Countries: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.country, tableName: 'geo.countries' },
    Districts: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.district, tableName: 'geo.districts' },
    Oceans: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.ocean, tableName: 'geo.oceans' },
    Places: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.place, tableName: 'geo.places' },
    PlaceTypes: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.placetype, tableName: 'geo.placetypes' },
    PlaceSiblings: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.sibling, tableName: 'geo.places.siblings' },
    PlaceParents: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.parent, tableName: 'geo.places.parent' },
    PlaceNeighbors: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.neighbor, tableName: 'geo.places.neighbors' },
    PlaceCommons: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.common, tableName: 'geo.places.common' },
    PlaceChildrens: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.children, tableName: 'geo.places.children' },
    PlaceBelongtos: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.belongto, tableName: 'geo.places.belongtos' },
    PlaceAncestors: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.ancestor, tableName: 'geo.places.ancestors' },
    Seas: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.sea, tableName: 'geo.seas' },
    States: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.state, tableName: 'geo.states' },
    PlaceDescendants: { type: _core2.default.EntitySet, elementType: _core2.default.Yahoo.types.Geo.descendant, tableName: 'geo.places.descendants' },

    placeTypeNameRef: { value: _core2.default.Yahoo.types.Geo.placeTypeNameCf },
    centroidRef: { value: _core2.default.Yahoo.types.Geo.centroidCf },
    countryRef: { value: _core2.default.Yahoo.types.Geo.countryCf },
    adminRef: { value: _core2.default.Yahoo.types.Geo.adminCf },
    localityRef: { value: _core2.default.Yahoo.types.Geo.localityCf },
    postalRef: { value: _core2.default.Yahoo.types.Geo.postalCf },
    boundingBoxRef: { value: _core2.default.Yahoo.types.Geo.boundingBoxCf },

    //Data
    Atom: {
        anonymousResult: true,
        tableName: 'atom',
        resultPath: ["query", "results"],
        resultSkipFirstLevel: true,
        type: _core2.default.EntitySet,
        elementType: _core2.default.Class.define("$data.Yahoo.types.YQLAtom", _core2.default.Entity, null, {
            url: { type: 'string', required: true, searchable: true }
        }, null)
    },
    Csv: {
        anonymousResult: true,
        tableName: 'csv',
        resultPath: ["query", "results"],
        resultSkipFirstLevel: true,
        type: _core2.default.EntitySet,
        elementType: _core2.default.Class.define("$data.Yahoo.types.YQLCsv", _core2.default.Entity, null, {
            url: { type: 'string', required: true, searchable: true },
            charset: { type: 'string', searchable: true },
            columns: { type: 'string', searchable: true }
        }, null)
    },
    DataUri: {
        anonymousResult: true,
        tableName: 'data.uri',
        resultPath: ["query", "results"],
        resultSkipFirstLevel: true,
        type: _core2.default.EntitySet,
        elementType: _core2.default.Class.define("$data.Yahoo.types.YQLDataUri", _core2.default.Entity, null, {
            url: { type: 'string', required: true, searchable: true }
        }, null)
    },
    Feed: {
        anonymousResult: true,
        tableName: 'feed',
        resultPath: ["query", "results"],
        resultSkipFirstLevel: true,
        type: _core2.default.EntitySet,
        elementType: _core2.default.Class.define("$data.Yahoo.types.YQLFeed", _core2.default.Entity, null, {
            url: { type: 'string', required: true, searchable: true }
        }, null)
    },
    FeedNormalizer: {
        anonymousResult: true,
        tableName: 'feednormalizer',
        resultPath: ["query", "results"],
        resultSkipFirstLevel: true,
        type: _core2.default.EntitySet,
        elementType: _core2.default.Class.define("$data.Yahoo.types.YQLFeedNormalizer", _core2.default.Entity, null, {
            url: { type: 'string', required: true, searchable: true },
            output: { type: 'string', searchable: true },
            prexslurl: { type: 'string', searchable: true },
            postxslurl: { type: 'string', searchable: true },
            timeout: { type: 'string', searchable: true }
        }, null)
    },
    Html: {
        anonymousResult: true,
        tableName: 'html',
        resultPath: ["query", "results"],
        resultSkipFirstLevel: true,
        type: _core2.default.EntitySet,
        elementType: _core2.default.Class.define("$data.Yahoo.types.YQLHtml", _core2.default.Entity, null, {
            url: { type: 'string', required: true, searchable: true },
            charset: { type: 'string', searchable: true },
            browser: { type: 'bool', searchable: true },
            xpath: { type: 'string', searchable: true },
            compat: { type: 'string', searchable: true, description: "valid values for compat is 'html5' and 'html4'" },
            Result: { type: 'string', searchable: true }
        }, null)
    },
    Json: {
        anonymousResult: true,
        tableName: 'json',
        resultPath: ["query", "results"],
        resultSkipFirstLevel: true,
        type: _core2.default.EntitySet,
        elementType: _core2.default.Class.define("$data.Yahoo.types.YQLJson", _core2.default.Entity, null, {
            url: { type: 'string', required: true, searchable: true },
            itemPath: { type: 'string', searchable: true }
        }, null)
    },
    Rss: {
        anonymousResult: false,
        tableName: 'rss',
        resultPath: ["query", "results"],
        resultSkipFirstLevel: true,
        type: _core2.default.EntitySet,
        elementType: _core2.default.Class.define("$data.Yahoo.types.YQLRss", _core2.default.Entity, null, {
            url: { type: 'string', required: true, searchable: true },
            guid: { type: 'GuidField' },
            title: { type: 'string' },
            description: { type: 'string' },
            link: { type: 'string' },
            pubDate: { type: 'string' }
        }, null)
    },
    GuidField: {
        type: _core2.default.Class.define("GuidField", _core2.default.Entity, null, {
            isPermaLink: { type: 'string' },
            content: { type: 'string' }
        }, null)
    },
    Xml: {
        anonymousResult: true,
        tableName: 'xml',
        resultPath: ["query", "results"],
        resultSkipFirstLevel: true,
        type: _core2.default.EntitySet,
        elementType: _core2.default.Class.define("$data.Yahoo.types.YQLXml", _core2.default.Entity, null, {
            url: { type: 'string', required: true, searchable: true },
            itemPath: { type: 'string', searchable: true }
        }, null)
    },
    Xslt: {
        anonymousResult: true,
        tableName: 'xslt',
        resultPath: ["query", "results"],
        resultSkipFirstLevel: true,
        type: _core2.default.EntitySet,
        elementType: _core2.default.Class.define("$data.Yahoo.types.YQLXslt", _core2.default.Entity, null, {
            url: { type: 'string', searchable: true },
            xml: { type: 'string', searchable: true },
            stylesheet: { type: 'string', searchable: true },
            stylesheetliteral: { type: 'string', searchable: true },
            wrapperelement: { type: 'string', searchable: true }
        }, null)
    }

}, null);