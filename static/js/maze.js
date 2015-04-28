'use strict';

function Maze(){
	this.map = [];
	new ROT.Map.EllerMaze(MAZE_WIDTH, MAZE_HEIGHT).create(function(x, y, wall){
		if(!wall){
			return;
		}
		if(Math.random() < .075 && x !== 0 && y !== 0 && x !== MAZE_WIDTH - 1 && y !== MAZE_HEIGHT - 1){
			return;
		}

		var box = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshPhongMaterial({
				color: 0xff0000,
				side: THREE.DoubleSide
			})
		);

		box.position.x = x - MAZE_WIDTH/2 + .5;
		box.position.y = y - MAZE_HEIGHT/2 + .5;
		box.position.z = .5;

		if(!this.map[x]){
			this.map[x] = [];
		}
		this.map[x][y] = box;

		scene.add(box);
	}.bind(this));
}

Maze.prototype.findOpenSpace = function(){
	var x;
	var y;
	do{
		x = Math.floor(Math.random() * MAZE_WIDTH);
		y = Math.floor(Math.random() * MAZE_HEIGHT);
	}while(maze.map[x][y]);
	return {x: x, y: y};
}
