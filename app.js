var express = require('express');
var app = express();
var path = require("path");
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

io.sockets.on('connection',function(socket){
	connections.push(socket);
	console.log('Connected : %s sockets Connected',connections.length);
	
	//io.sockets.emit('join left group',{joinleft:connections.length});
	
	socket.on('disconnect',function(data){
		if(users.indexOf(socket.username)!==-1){
			users.splice(users.indexOf(socket.username),1);
			updateusernames();
		}
		connections.splice(connections.indexOf(socket),1);
		io.sockets.emit('join left group',{joinleft:connections.length});
		console.log('Disconected : %s sockets Connected',connections.length);
	});
	
	socket.on('login user', function(data,calback){
		if(users.indexOf(data)==-1){
			calback(true);
			socket.username = data;
			users.push(socket.username);
			updateusernames();
		}else{
			calback(false);
			//io.sockets.emit('login fail',{msg:data});
		}
		
	});
	
	socket.on('log out', function(data,calback){
		calback(true);
		if(users.indexOf(socket.username)!==-1){
			users.splice(users.indexOf(socket.username),1);
			updateusernames();
		}
	});
	
	socket.on('send message', function(data){
		io.sockets.emit('new message',{
			msg:data,
			user:socket.username
		});
	});
	
	function updateusernames(){
		io.sockets.emit('new user',users);
	}
	
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