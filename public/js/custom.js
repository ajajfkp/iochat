$(function(){
	var socket = io.connect();
	
	var $msgForm = $("#messageForm");
	var $message = $("#message");
	var $chat = $("#chat");
	var $users = $("#users");
	var $msgArea = $("#msgArea");
	
	var $userForm = $("#userForm");
	var $username = $("#username");
	var $userArea = $("#userArea");
	var height = $chat.height();
	var $logout = $("#logout");
	var $loginIno = $("#loginIno");
	
	$logout.click(function(){
		socket.emit('log out','',function(data){
			$userArea.show();
			$msgArea.hide();
			$chat.text('');
		});
	});
	
	$userForm.submit(function(e){
		if(!$username.val()){
			return false;
		}
		e.preventDefault();
		socket.emit('login user',$username.val(),function(data){
			if(data){
				$loginIno.html('<strong>Login With : </strong>'+$username.val());
				$("#loginInoId").val($username.val());
				$userArea.hide();
				$msgArea.show();
				$username.val('');
			}else{
				var flash = "A user alsow login with same userid..";
				$('#flashmsg').show();
				$('#flashmsg').html(flash);
				setTimeout(function(){
					$('#flashmsg').fadeOut(1000,function(){
						$('#flashmsg').html('');
					});
				},5000);
			}
		});
	});
	
	$msgForm.submit(function(e){
		var sendMsg = "";
		if($("#sltUser").is(":checked")){
			sendMsg = $("#sltUser").val()+$message.val();
		}else{
			sendMsg = $message.val()
		}
		if(!sendMsg){
			return false;
		}
		e.preventDefault();
		socket.emit('send message',sendMsg,function(data){
			$chat.append('<li class="list-group-item">'+data+'</i></span></li>');
			$chat.animate({scrollTop: height}, 500);
			height += $chat.height();
		});
		$message.val('');
	});

	$("#message").on('keypress',function(e){
		if(e.which == 13 && !e.shiftKey) {
			if(!$message.val()){
				return false;
			}
			e.preventDefault();
			socket.emit('send message',$message.val());
			$message.val('');
		}
	});
	
	socket.on('new user',function(data){
		var html = '';
		for(i in data){
			html +='<li class="list-group-item" onclick="sendprivate(\''+data[i]+'\');">'+data[i]+'</li>';
		}
		$users.html(html);
	});

	socket.on('new message',function(data){
		$chat.append('<li class="list-group-item"><strong>'+data.user+' : </strong>'+data.msg+'<span class="pull-right" style="color: lightblue;"><i>'+dateTime()+'</i></span></li>');
		$chat.animate({scrollTop: height}, 500);
		height += $chat.height();
	});
	
	socket.on('privatemsg',function(data){
		$chat.append('<li class="list-group-item"><strong>'+data.user+' : </strong>'+data.msg+'<span class="pull-right" style="color: lightblue;"><i>'+dateTime()+'</i></span></li>');
		$chat.animate({scrollTop: height}, 500);
		height += $chat.height();
	});
	
	$("#sltUser").click(function(){
		if(!$("#sltUser").is(":checked")){
			$("#sltUser").val("");
			$("#sltUser").prop("disabled",true);
			$("#sltUserArea").html("");
		}
	});
	
})


function sendprivate(selected){
	if(selected==$("#loginInoId").val()){
		return false;
	}
	$("#sltUserArea").html(selected);
	$("#sltUser").val("/w "+selected+" ");
	$("#sltUser").prop('disabled',false);
	$("#sltUser").prop('checked',true);
}

//construct date time
function dateTime(){
	var d = new Date();
	var date = d.getDate();
	var hour = d.getHours();
	var minutes = d.getMinutes();
	var month = new Array(12);
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
	var month = month[d.getUTCMonth()].substr(0,3)
    return  dateStr = month+' '+date+', '+managHrs(hour)+':'+managMin(minutes);
}
function managHrs(hrs){
	if(hrs.length<2){
		return hrs='0'+hrs
	}else{
		return hrs;
	}
}

function managMin(mins){
	if(mins<10){
		return mins='0'+mins;
	}else{
		return mins;
	}
}

