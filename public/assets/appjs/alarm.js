  $('#time_picker').kendoTimePicker({
      format: "HH:mm:ss"
  });

  $('#time').click(function(){
     
      $('#time_picker').attr('name','time_value'); 
      $('#time_picker').css('height','30px'); 
      $('.time_picker').show(); 

      $('#time_value').removeAttr('name');
      $('#time_value').hide();
  });

  
  $('#interval').click(function(){

      $('#time_picker').removeAttr('name');
      $('.time_picker').hide();

      $('#time_value').attr('name','time_value'); 
      $('#time_value').show(); 
  });    

 
  var actions = '<div class="sensor-action">'
                  +'<select name="action[]" class="form-control input-group action_list">'
                      +'<option >Select Action</option>'
                  +'</select><input type="hidden" name="actionName[]" value="" class="actionName"><span class="action-msg"></span></div>';

  var sensorsList = $('#sensor').parents('.form-group').html();
  sensorsList = sensorsList.replace('selected', '');
  var counter = 0;

  // add more rules
  $(document).on('click','.more-action', function(){

      var html = '<div class="add-actions" ><div class="form-group">'
                    +'<label for="inputEmail" class="sr-only">Condition</label>'
                    +'<select name="condition[]" id="action-'+counter+'" class="form-control input-group">'
                        +'<option value="&&">And</option>'
                        +'<option value="||">OR</option>'
                    +'</select>'
                    +'<span class="image-msg"></span>'
                  +'</div>'
                  +sensorsList+'<br /><div class="form-group">'
                    +'<label for="inputEmail" class="sr-only">Rule</label>'
                    +actions+'<div class="remove-action whiteText" style="cursor:pointer;">Remove</div>'
                  +'</div></div>';

      $('#more-action').append(html) ;

      setActionName();
  });

  // remove rules
  $(document).on('click','.remove-action', function(){
      $(this).parents('.add-actions').remove();       
  });


  // get selected sensors functions 
  $(document).on('change','.sensor', function(){

     
     var _this = $(this);
     var indexNo = _this.index('.sensor');
     _this.parents('.sensors-list').find('input').val( $('.sensor:eq('+indexNo+') option:selected').text() );

     var indexObj = $('.sensor-action:eq('+indexNo+')');
     // console.log( 'index=>'+indexNo+'length=>'+$('.sensor-action').length );
      $.post( "/actions/getActions", { sensorId: _this.val() }, function( result ) {

        if(result.length > 0){

          var action='<select name="action[]" class="form-control input-group action_list">';

          $.each(result, function(index, elem){
             // $.each(result[index].actions, function(key, val){
                action += '<option value="'+elem._id+'">'+elem.name+'</option>';
              //}); 
          });             
          
          action += '</select>'
                     +'<input type="hidden" name="actionName[]" value="" class="actionName"><span class="action-msg"></span>';

          if( indexNo > 0 ){
            indexObj.html(action);
          } 
          else{
            console.log('else')
            $('#actions-list').find('.sensor-action').html(action);
          }          

          setActionName();
        }
        else{

            var act='<div class="sensor-action"><select name="action[]" class="form-control input-group action_list">'
              +'<option >Select Action</option>'
              +'</select><span class="action-msg"></span></div>';

           
            if( indexNo > 0 ){
                indexObj.html(act);
            }
            else{
               $('#actions-list').html(act);
            } 
            alert('Action not available');
        }

      });
  });

 
  // form validation
  $('.add-device').submit(function(){

      $('.alarmName-msg').text('');
      if( $('#alarmName').val() == ''){
          $('.alarmName-msg').text('Please enter alarm name*');
          $('#alarmName').focus();
          return false;
      }

      $('.sensor-msg').text('');
      if( $('#sensor').val() == ''){
          $('.sensor-msg').text('Please select any sensor*');
          $('#sensor').focus();
          return false; 
      }

      $('.time-msg').text('');
      if( !$('#interval').is(':checked') && !$('#time').is(':checked') ){
          $('.time-msg').text('Please choose interval or time*');
          return false;
      }

      if( $('#time_value').val() == '' && $('#time_picker').val() == '' ){
          $('.time-msg').text('Please enter time or interval value*');
          $('#time_value').focus();
          return false;
      }

      $('.alertby-msg').text('');
      if( !$('#sms').is(':checked') && !$('#mail').is(':checked') ){
          $('.alertby-msg').text('Please choose sms or mail or both option*');
          return false;
      }
    
      // action
      if( $('#callToAction').is(':checked') ){

          $('.call-to-action-msg').text('');
          if( $('#call-action').val() == '' ){
            $('.call-to-action-msg').text('Please enter call to action*');
            return false;
          }
      }

      var flag = true;

      // action list validation
      $('.action_list').each(function(key, val){

          if( $('.action_list:eq('+key+') option:selected').val() == undefined || $('.action_list:eq('+key+') option:selected').val() == 'Select Action' ){
              $(this).parents('.sensor-action').find('.action-msg').text('Please select action*');
            flag = false;  
            return false;  
          }
      }); 

      if(!flag){
        return flag;
      }

      if( checkActionName() == false ){
          $('.alarmName-msg').text('Alarm name not available*');
          return false;
      }
  });

  // show call to action box
  $('#callToAction').click(function(){
      if( $(this).is(':checked') ){
          $('#callAction').show();
      }
      else{
          $('#callAction').hide();
          $('#call-action').val('');
      }
  });

  // set action name
  $(document).on('change', '.action_list', function(){
    setActionName();
  });

  function setActionName(){

     $('.action_list').each(function(key, val){

        var text = $('.action_list:eq('+key+') option:selected').text();
        //console.log('text=>'+text)
        //$(this).parents('.sensor-action').find('.actionName').val(text);
        $('.actionName:eq('+key+')').val(text);
     });
  }

  $('#alarmName').blur(function(){
       if( checkAlarmName() == false ){
          $('.alarmName-msg').text('Alarm name not available*');
          return false;
      }

      $('.alarmName-msg').text('');
  });

  function checkAlarmName(){

    if( $('#alarmName').val() != '' ){

        var flag = false;
      
        $.ajax({
            url: '/alarm/checkAlarmName',
            type: 'POST',
            async: false,
            data: { alarmName: $('#alarmName').val() },
            success: function(data){
              if(data == 1){
                flag = false;
              }
              else{
                 flag = true;
              }
            }
        });

       //console.log('flag=>'+flag); 
       return flag; 
    }
    
 } 