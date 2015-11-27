/*************************************
* App configuration
**************************************/

// define global configuration of app
global.defaultPage = 'login.html';
global.defaultController = 'login';
global.fileExt = '.html';
global.secretKey = 'ssshhhhh';
global.view = 'views';
global.resource = 'public';
global._portRedis   = 6379;
global._HostRedis   = '127.0.0.1';
global.portNo = process.env.PORT || '8080'; 
global.accessPath = '54.255.185.184';
global.url = 'http://' + accessPath + ':'+portNo;
global.fileUploads = 'uploads/';
global.allowFiles = {'image/png':'png', 'image/gif':'gif', 'image/jpg':'jpg', 'image/jpeg':'jpeg'};

global.connections = {
	'defaultConnection':'mongoDb',
	'mongoDb': {
		host : 'localhost',
		port : '27017',
		databaseName : 'kioxApp'
	}
}


module.exports = {
	init:function(){
		var server = require('./server');
		server.init();
	}
}
