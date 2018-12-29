var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users=[];
connections= [];
port = 3001;

server.listen(process.env.PORT ||port);
console.log('Server started.');

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
	socket.on('send message', function(data) {
		console.log(data);
		io.sockets.emit('new message', {msg:data});
	});
	
	connections.push(socket);
	console.log(connections.length+'clients connected.');

	socket.on('disconnect', () => { 
	io.sockets.emit('new message', {msg:'Server: '+socket.userName+' has disconnected.'});
	users.splice(users.indexOf(socket.userName),1);
	console.log(socket.userName+' disconnected');

	updateUserNames();
	connections.splice(connections.indexOf(socket),1 ); 
	
	});

	
	socket.on('new user', function(user, callback) {

		socket.userName=user;
		users.push(user);
		updateUserNames();
		io.sockets.emit('new message', {msg:'Server: '+user+' has joined.'});
		callback(true);
	});
	
	function updateUserNames() {
		io.sockets.emit('update user list', users);
	}
});
