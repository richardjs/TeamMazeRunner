'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var PORT = 3000;

app.use(express.static(__dirname + '/static'));

io.on('connection', function(socket){
	console.log('connection');
});

http.listen(PORT);
console.log('server started on :' + PORT);
