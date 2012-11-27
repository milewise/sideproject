var DB = require('../lib/database').DB
var users = DB.collection('users')
var debug = require('debug')('users')

users.findById = function (id, callback) {
    debug('findById:', id)    
}

users.create = function (user, callback) {
    _.defaults(user, {
        fullName: null,
        shortBio: null,
        fullBio: null,
        picture: null,
        links: [],
        website: null,
        projects: [], // array of project document _ids
    })
    // TODO: hash user password
    users.insert(user, { safe: true }, function (err, user) {
        callback(err, user[0])
    })
}

module.exports = users