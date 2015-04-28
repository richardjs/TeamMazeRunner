'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Maze = require('./maze.js').Maze;

var PORT = 3000;

app.use(express.static(__dirname + '/static'));

console.log('generating map...');
var maze = new Maze();

var clients = [];

io.on('connection', function(socket){
	console.log('connection from ' + socket.handshake.address);
	clients.push(socket);

	socket.on('disconnect', function(){
		console.log('disconnect from ' + socket.handshake.address);
		clients.splice(clients.indexOf(socket), 1);
	});

	socket.emit('maze data', maze);
	socket.emit('role', 'helper');
});

var lastTime = 0;
function frame(){
	var time = new Date().getTime();
	if(lastTime){
		var delta = time - lastTime;
	}else{
		delta = 1;
	}
	lastTime = time;
}
setInterval(frame, 25);


http.listen(PORT);
console.log('server started on :' + PORT);
