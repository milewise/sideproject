var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var debug = require('debug')('auth')

var ObjectID = require('./database').Types.ObjectID
var users = require('../models/users')

// Local Auth Strategy
// -- try and find user in users collection MongoDB

var strategyOptions = {
    usernameField: 'email',
    passwordField: 'password'
}

var strategyCallback = function(username, password, done) {

    debug('Looking for %s in DB.users...', username)
    
    users.findOne({ email: username }, function(err, user) {
        if (err) {
            debug.error(err)
            return done(err) 
        }
        if (!user) {
            debug('%s not found!', username)
            return done(null, false, { message: 'Incorrect username.' })
        }
        debug('Found:', user)        
        if (user.password !== password) {
            debug('Password %s invalid!', password)
            return done(null, false, { message: 'Incorrect password.' })
        }
        return done(null, user)
    })

}

// Tell passport to use our auth strategy
var strategy = new LocalStrategy(strategyOptions, strategyCallback)
passport.use(strategy);

passport.serializeUser(function(user, done) {
    debug('serializeUser: ', user)
    done(null, user._id)
})

passport.deserializeUser(function(id, done) {
    debug('deserializeUser: ', id)
    users.findOne({ _id: ObjectID(id) }, function (err, user) {
        debug('found: ', user)
        done(err, user)
    })
})

function authenticate(options) {
    debug('authenticate: ', options)
    options = options || {}
	_.defaults(options, { 
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
	return passport.authenticate('local', options)
}

exports.passport = passport
exports.authenticate = authenticate