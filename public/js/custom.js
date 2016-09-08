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
	
	var $logout = $("#logout");
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
			console.log(data);
			if(data){
				$username.val('');
				$userArea.hide();
				$msgArea.show();
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
		if(!$message.val()){
			return false;
		}
		e.preventDefault();
		socket.emit('send message',$message.val());
		$message.val('')
	});

	
	socket.on('new user',function(data){
		var html = '';
		for(i in data){
			html +='<li class="list-group-item">'+data[i]+'</li>';
		}
		$users.html(html);
	});

	socket.on('new message',function(data){
		$chat.append('<li class="list-group-item"><strong>'+data.user+' : </strong>'+data.msg+'</li>');
	});
	
})