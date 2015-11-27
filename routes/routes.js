var url = require('url');
var routerLib = require('./router-lib');
global.controller = require('../lib/controller');
global.model = require('../lib/model-'+global.connections.defaultConnection);

module.exports = {

	init:function(router){
		
		// manage all routes of requests
		router.all('*',function(req, res){

			var pathname = url.parse(req.url).pathname; 
			routerLib.init(router, req, res, pathname);

			if( pathname  == '/'){

				var mainController = require('../controllers/'+defaultController+'-controller');
				var ctrl = new mainController()
				ctrl.index();

			}
			else if(req.url != '/favicon.ico' && req.url.indexOf('/kiox.sh') == -1 && req.url.indexOf('/kiox.tar.gz') == -1 ){
				
				var arg = pathname.split('/');
				
				if( arg.length > 2 && arg[2] != ''){

					try{
						var mainController = require('../controllers/'+arg[1]+'-controller');
						var ctrl = new mainController()
						var model = arg[2];
						ctrl[model]();					
						//model.apply(ctrl,[]);
					}
				  	catch(err) {
				  		var c = new controller();
						c.errorPage();
				  	}					
				}
				else{

					try{
						var mainController = require('../controllers/'+arg[1]+'-controller');
						var ctrl = new mainController()
						ctrl.index();
					}
					catch(err) {
						var c = new controller();
						c.errorPage();
					}
				}	
			}

			else if( req.url.indexOf('/kiox.sh') != -1 ){
				
				var filename = req.url.replace('/','');
				var file = req.query.file, path = process.cwd()+'/'+ filename;
				res.download(path, filename);				
			}

			else if( req.url.indexOf('/kiox.tar.gz') != -1 ){

				var fileName = req.url.replace('/','');
				var path = require('path');
				var mime = require('mime');
				var fs = require('fs');

				var file = process.cwd()+'/'+ fileName;

				var filename = path.basename(file);
				var mimetype = mime.lookup(file);
				//console.log('mimetype=>'+mimetype)

				res.setHeader('Content-disposition', 'attachment; filename=' + filename);
				res.setHeader('Content-type', mimetype);

				var filestream = fs.createReadStream(file);
				filestream.pipe(res);
			}
		});
	}
}