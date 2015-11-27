
module.exports = function(){

	// get current date
	getDate = function(){
		var d = new Date();
		return date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDay();
	}

	// get current time
	getTime = function(){
		var d = new Date();
		return time = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
	}

	this.errorPage = function(){
		Res.render('error'+fileExt, {url:url});
		Res.end();
	}
	
}