// Globals

_ = require('underscore')

// Module Deps

var debug = require('debug')('app')
var express = require('express')
var flash = require('connect-flash')
var stylus = require('stylus')
var bootstrap = require('bootstrap-stylus')
var config = require('./config')
var auth = require('./lib/auth')
var users = require('./models/users')

// Configuration

var app = express()
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('people are awesome'));
    app.use(express.session({ secret: 'people are awesome' }));
    app.use(auth.passport.initialize())
    app.use(auth.passport.session())
    app.use(flash())
    app.use(app.router);
    app.use('/public/css', stylus.middleware({
        src: __dirname + '/public/css',
        compile: function (str, path) {
          return stylus(str)
                  .set('filename', path)
                  .use(bootstrap())
        }
    }))
    app.use('/public', express.static(__dirname + '/public'));
})

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })) 
})

app.configure('production', function(){
    app.use(express.errorHandler()) 
})

// Setup Routes

app.get('/', function(req, res) {
    res.render('index', {
        user: req.user,
        flash: req.flash()
    })
})

app.get('/signup', function (req, res) {
    res.render('signup', {
        user: req.user,
        flash: req.flash()
    })
})

app.post('/signup', function (req, res) {
    var email = req.body.email
    var password = req.body.password

    var error = false
    
    if (!req.body.email) {
        req.flash('error', 'Email address is required.')
        error = true
    }
    if (!req.body.password) {
        req.flash('error', 'Password is required.')
        error = true
    }

    if (error) {
        res.redirect('/signup')
        return
    }

    var loginUser = function (err, user) {
        if (err) {
            if (err.code == 11000) 
                req.flash('error', 'A user with that email already exists.')
            else 
                req.flash('error', 'Something went wrong. Please try again later.')
            res.redirect('/signup')
            return
        }

        debug('Account created. Login... ', user)
        req.login(user, redirectUser)
    }

    var redirectUser = function (err) {
        if (err) {
            debug('Login failed!')
            req.flash('error', 'Account created. Please login.')
            res.redirect('/login')
            return
        }
        debug('Welcome!')
        req.flash('success', 'Welcome to Sideproject!')
        res.redirect('/')
    }

    users.create({
        email: email,
        password: password
    }, loginUser)
})

app.get('/login', function (req, res) {
    res.render('login', {
        user: req.user,
        flash: req.flash()
    })
})

app.post('/login', auth.authenticate({ successFlash: 'Login successful!' }), function (req, res) {
    res.redirect('/')
})

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

var PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("Express server listening on port %d in %s mode", PORT, app.get('env'))

module.exports = app