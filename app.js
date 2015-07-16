var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var HTMLing	   = require('htmling');
var routes = require('./routes/index');
var users = require('./routes/users');
var passport = require('passport');
var expressSession = require('express-session');
var mongoose       = require('mongoose');
var dbConnection   = mongoose.connect('mongodb://localhost/node_sample');
var models         = require('./models/model');
var app = express();

// view engine setup
app.set('view engine', 'html');
app.engine('html', HTMLing.express(__dirname + '/views/', {watch: true}));  
  
dbConnection.model('User',models.User,'users');
dbConnection.model('Project',models.Project,'projects');
 

app.set('views', path.join(__dirname, 'views'));


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret:'myScretKey'}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/bower_components',  express.static(__dirname + '/bower_components'));

//app.use('/', routes);
//app.use('/users', users);
//app.use('/users/signup',)

var flash = require('connect-flash');
app.use(flash());


var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);


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
    res.status(err.status || 500).send({error:err.error});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	console.log(err);
  //res.status(err.status || 500);
  /* res.render('error', {
    message: err.message,
    error: {}
  }); */
});

/******************************* Passport authentications *********************************/
  


module.exports = app;
