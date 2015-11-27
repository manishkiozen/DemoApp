

getModules = function(data, url){
	var modules;
    $.ajax({
        type: "post",
        data: data,
        async: false,
        url: url,
        success: function(res){
          if( res.staus == 0 && res.msg == 'logout' ){
          	window.location.href = domain+'/login';
          }
          else if( res.staus == 1){
          	modules = res;
          }
          else if( res.staus == 0 && res.msg != 'logout' ){
            alert(res.msg);
          }
        }
    });
    
    return modules;
}

getInfo= function(data, url){
	var sensors;
    $.ajax({
        type: "post",
        data: data,
        async: false,
        url: url,
        success: function(res){
          if( res == 'logout' ){
          	window.location.href = domain+'/login';
          }
          else{
          	sensors = res;
          }
        }
    });
    
    return sensors;
}

saveInfo= function(data, url){
  var result;
    $.ajax({
        type: "post",
        data: data,
        async: false,
        url: url,
        success: function(res){
          if( res == 'logout' ){
            window.location.href = domain+'/login';
          }
          else{
            result = res;
          }
        }
    });
    
    return result;
}
