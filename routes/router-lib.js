global.Router;
global.Req;
global.Res;
global.Path;

module.exports = {
	
	init : function(router, req, res, pathname){
		Router = router;
		Req = req;
		Res = res;
		Path = pathname;
	}

}