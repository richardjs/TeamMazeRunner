'use strict';

function findOpenSpace(maze){
	var x;
	var y;
	do{
		x = Math.floor(Math.random() * maze.width);
		y = Math.floor(Math.random() * maze.height);
	}while(maze.map[x][y]);
	return {x: x, y: y};
}
