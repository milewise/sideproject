var mongode = require('mongode')
var config = require('../config')
var debug = require('debug')('database')

debug('connecting to %s', config.settings.db)
var DB = mongode.connect(config.settings.db, { safe: false })

exports.DB = DB
exports.Types = {
    ObjectID: mongode.BSON.ObjectID,
    Timestamp: mongode.BSON.Timestamp
}
