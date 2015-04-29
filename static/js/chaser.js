'use strict';

var CHASER_SIZE = .7;
var CHASER_MOVE_SPEED = .5;

function Chaser(x, y, color){
	this.x = x;
	this.y = y;

	this.mesh = new THREE.Mesh(
		new THREE.BoxGeometry(CHASER_SIZE, CHASER_SIZE, CHASER_SIZE),
		new THREE.MeshPhongMaterial({
			color: color,
		})
	);
	this.mesh.position.x = this.x - maze.width/2 + .5;
	this.mesh.position.y = this.y - maze.height/2 + .5;
	this.mesh.position.z = .5;
	scene.add(this.mesh);

	this.targetX = x;
	this.targetY = y;
	
	this.path = [];
}

Chaser.prototype.newPath = function(){
	var dijkstra = new ROT.Path.Dijkstra(player.x, player.y, function(x, y){
		return !maze.map[x][y];
	}, {topology: 4});
	dijkstra.compute(this.x, this.y, function(x, y){
		var step = {x: x, y: y};
		this.path.push(step);
	}.bind(this));
}

Chaser.prototype.nextStep = function(){
	var step = this.path.shift();
	this.targetX = step.x;
	this.targetY = step.y;
}

Chaser.prototype.update = function(delta){
	var moveDistance = CHASER_MOVE_SPEED * delta / 1000;
	if(this.path.length === 0){
		this.newPath();
		this.nextStep();
	}
	if(Math.abs(this.x - this.targetX) < moveDistance){
		this.x = this.targetX;
	}else{
		if(this.x < this.targetX){
			this.x += moveDistance;
		}else{
			this.x -= moveDistance;
		}
	}
	if(Math.abs(this.y - this.targetY) < moveDistance){
		this.y = this.targetY;
	}else{
		if(this.y < this.targetY){
			this.y += moveDistance;
		}else{
			this.y -= moveDistance;
		}
	}
	if(this.x === this.targetX && this.y === this.targetY){
		this.nextStep();
	}
	this.mesh.position.x = this.x - maze.width/2 + .5;
	this.mesh.position.y = this.y - maze.height/2 + .5;
}
