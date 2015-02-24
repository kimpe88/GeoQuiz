var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var auth = require('./models/auth');
var User = require('./models/user');

var index = require('./routes/index');
var play = require('./routes/play');
var api = require('./routes/api');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

// Custom routes
app.use('/', index);
app.use('/play', auth.isAuthenticated, play);
app.use('/api', auth.isAuthenticated, api);


// Quick fix for login, should be replaced with
// facebook auth or more advanced system
app.post('/login', auth.isAuthenticated, function(req, res){
  console.log('auth successful');
  res.sendStatus(200);
});

// Creates a new user by sending a POST to /user
// @param {String} username
// @param {String} password
app.post('/user', function(req,res){
  var username = req.body.username;
  var password = req.body.password;

  var intErr = function(){
    res.status(500);
    res.json("Failed to create user");
  };

  if(username === undefined || password === undefined) {
    res.status(400);
    return res.json("Missing username or password");
  }

  User.findOne({username: username}, function(err, user) {
    if(err) {
      return intErr();
    }
    // If username already exists we can't register
    if(user) {
      res.status(400);
      return res.json("Username taken");
    }
    user = new User({username: username, password: password});
    user.save(function(err,user){
      if(err) {
        return intErr();
      }
      res.status(201);
      return res.json("User successfully created");
    });
  });
});


// Setup database
var database = process.env.NODE_ENV || 'development';
var connectURI = process.env.MONGOLAB_URI || 'mongodb://localhost/' + database;
mongoose.connect(connectURI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Successfully connected to database");
});
// Pass ref to database connection with every request
app.use('*', function(res, req, next) {
  req.db = db;
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
