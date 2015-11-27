/************************
** add require module
************************/
var express = require('express'),
			path = require('path'),
			http = require('http'),
			ejs = require('ejs'),
			logger = require('morgan'),
			bodyParser = require('body-parser'),
			cookieParser = require('cookie-parser'),
			methodOverride = require('method-override'),
			expressSession = require('express-session'),
			routes = require('../routes/routes'),
			redisIO = require('socket.io-redis')
			redis = require('redis');


			//redisStore = require('connect-redis')(expressSession);
			
			//expressValidator = require('express-validator'); //Declare Express-Validator

			global.q = require("q"); // store promise module globally


module.exports = obj = {
	
	startApp: function(){

		
	
		var app = express();
		var router = express.Router();
		//var client = redis.createClient(); //CREATE REDIS CLIENT

		// set application enviornment 
		app.set('port', portNo);
		app.set('views', path.join(__dirname, '..', '/'+view));
		app.set('view engine', 'html');
		app.engine('html', ejs.renderFile);	

		// configure application  
	    app.use( express.static( path.join(__dirname, '..', '/'+resource) ) );   // set the static files location
	    app.use(logger('dev'));                         // log every request to the console
	    app.use(bodyParser.json()); // parse request data into json
	    app.use(bodyParser.urlencoded({extended:false})); 
	    app.use(cookieParser()); 
		app.use(
				expressSession({
				  secret: secretKey,
				  //store: new redisStore({ host: '127.0.0.1', port: 6379, client: client }),
				  resave: true,
				  saveUninitialized: true
				})
			);
	    //app.use(expressValidator);  //required for Express-Validator
  
	    app.use(methodOverride());                      // simulate DELETE and PUT

		app.use(router); 
	    // set file rendering
	    routes.init(router);

		// create server
		var server = http.createServer(app)

		// socket connected
		global.io = require('socket.io').listen(server);

		//io.adapter(redisIO({ host: _HostRedis, port: _portRedis }));
	   
		// include socket
		var socket = require('./socket');
		socket.socketStart();

		// server listen port
		server.listen(portNo);

		server.on('listening', function(){
			console.log('Server started at ' + accessPath + ':'+portNo+' \n');
		});

		server.on('error', function(error){
			console.log('Server could not started at ' + accessPath + ':'+portNo+' \n'+error);
		});
	},

	init:function(){

		var cluster = require('cluster');
		var numCPUs = require('os').cpus().length;

		if (cluster.isMaster) {

		  for (var i = 0; i < numCPUs; i++) {
		    cluster.fork();
		  }

		  cluster.on('exit', function(worker, code, signal) {
		    console.log('worker ' + worker.process.pid + ' died');
		  });
		}
		else {
			obj.startApp();
		}
	}
}
