var logger = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes');
var path = require('path');
var errorHandler = require('errorhandler');
var express = require('express');
var cookieparser = require('cookieparser');
var passport = require('passport');
var confPassport = require('../config/passport');
var session = require('express-session');
var flash = require('connect-flash');
var cors = require('cors');

var configureCors = {
	origin: 'http://localhost:9000',
	credentials: true
}

module.exports = function(app){
	app.use(logger('dev'));
	app.use(bodyParser.json()); 
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(flash());
	//stuff required for passport
	app.use(session({
		secret: 'somefunsecrettotypeinhere',
		resave: true, //look into these options more
		saveUninitialized: true
	}));	
	confPassport(passport);
	app.use(passport.initialize());
	app.use(passport.session());
	app.use('/public/', express.static(path.join(__dirname, '../public')));
	app.use(cors(configureCors));
	routes.initialize(app, passport, new express.Router());
	if('development' === app.get('env')){
		app.use(errorHandler());
	}
	return app;

};