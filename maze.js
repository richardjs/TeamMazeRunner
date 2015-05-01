'use strict';

(function(exports){

var ROT = require('rot-js');

var MAZE_WIDTH = 51;
var MAZE_HEIGHT = 31;
var CHASERS = 3;
var GOALS = 15;

function Maze(){
	this.width = MAZE_WIDTH;
	this.height = MAZE_HEIGHT;

	this.map = [];
	new ROT.Map.EllerMaze(MAZE_WIDTH, MAZE_HEIGHT).create(function(x, y, wall){
		if(!wall){
			return;
		}
		if(Math.random() < .3 && x !== 0 && y !== 0 && x !== MAZE_WIDTH - 1 && y !== MAZE_HEIGHT - 1){
			return;
		}

		if(!this.map[x]){
			this.map[x] = [];
		}

		this.map[x][y] = true;

	}.bind(this));

	this.start = this.findOpenSpace();
	this.chaserStarts = [];
	this.chaserColors = [];
	for(var i = 0; i < CHASERS; i++){
		this.chaserStarts.push(this.findOpenSpace());
		this.chaserColors.push(Math.floor(0xffffff * Math.random()));
	}
	this.goalLocations = [];
	for(var i = 0; i < GOALS; i++){
		this.goalLocations.push(this.findOpenSpace());
	}
}

Maze.prototype.findOpenSpace = function(){
	var x;
	var y;
	do{
		x = Math.floor(Math.random() * MAZE_WIDTH);
		y = Math.floor(Math.random() * MAZE_HEIGHT);
	}while(this.map[x][y]);
	return {x: x, y: y};
}

exports.Maze = Maze;

})(exports);
