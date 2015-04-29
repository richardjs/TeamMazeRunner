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
var runner = null;

io.on('connection', function(socket){
	console.log('connection from ' + socket.handshake.address);
	clients.push(socket);

	socket.on('disconnect', function(){
		console.log('disconnect from ' + socket.handshake.address);
		clients.splice(clients.indexOf(socket), 1);

		if(socket === runner){
			console.log('runner disconnected');
			runner = null;
		}
	});

	socket.emit('maze data', maze);
	if(!runner){
		runner = socket;
		socket.emit('role', 'runner');
		console.log('new runner');

		socket.on('player update', function(player){
			for(var i = 0; i < clients.length; i++){
				clients[i].emit('runner update', player);
			}
		});
		socket.on('chasers update', function(chasers){
			for(var i = 0; i < clients.length; i++){
				clients[i].emit('chasers update', chasers);
			}
		});
	}else{
		socket.emit('role', 'helper');
	}
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
