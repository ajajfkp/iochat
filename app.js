var express = require('express');
var app = express();
var path = require("path");
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = {};
var connections = [];

io.sockets.on('connection',function(socket){
	socket.on('login user', function(data,calback){
		if(data in users){
			calback(false);
		}else{
			calback(true);
			socket.username = data;
			users[socket.username]=socket;
			updateusernames();
		}
	});
	
	socket.on('log out', function(data,calback){
		calback(true);
		if(data in users){
			delete users[socket.username];
			updateusernames();
		}
	});
	
	socket.on('send message', function(data,calback){
		var msg = data.trim();
		if(msg.substr(0,3)=='/w '){
			msg = msg.substr(3);
			ind = msg.indexOf(' ');
			if(ind!==-1){
				var name = msg.substring(0,ind)
				var msg = msg.substring(ind+1);
				if(name in users){
					users[name].emit('privatemsg',{
						msg:msg,
						user:socket.username
					});
					users[socket.username].emit('privatemsg',{
						msg:msg,
						user:socket.username
					});
				}else{
					calback('Err : please enter a valid user');
				}
			}else{
				calback('Err : please enter a message for user');
			}
		}else{
			io.sockets.emit('new message',{
				msg:msg,
				user:socket.username
			});
		}
	});
	
	function updateusernames(){
		io.sockets.emit('new user',Object.keys(users));
	}
	
	//************************connect disconnect block*********************************//
	connections.push(socket);
	console.log('Connected : %s sockets Connected',connections.length);
	socket.on('disconnect',function(data){
		delete users[socket.username];
		connections.splice(connections.indexOf(socket),1);
		console.log('Disconected : %s sockets Connected',connections.length);
	});
	
});










app.use(express.static(path.join(__dirname,'public')));

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});
app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), function(){
	console.log( 'Express started on http://localhost:' +
	app.get('port') + '; press Ctrl-C to terminate.' );
});