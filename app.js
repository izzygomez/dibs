// get all the tools we need
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

require('./config/passport')(passport); // pass passport for configuration

// required for passport
app.use(session({
  secret: 'derpaderpyderpderp',
  resave: false,
  saveUninitialized: false 
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// load in routes
var index = require('./routes/index');
var users = require('./routes/users');
var dashboard = require('./routes/dashboard');
var logout = require('./routes/logout');
var facebook = require('./routes/facebook');
var events = require('./routes/events');
var menus = require('./routes/menus');
var orders = require('./routes/orders');
var queues = require('./routes/queues');
require('./routes/auth')(app, passport);

// setup routes
app.use('/', index);
app.use('/users', users);
app.use('/dashboard', dashboard);
app.use('/logout', logout);
app.use('/facebook', facebook);
app.use('/events', events);
app.use('/menus', menus);
app.use('/orders', orders);
app.use('/queues', queues);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
