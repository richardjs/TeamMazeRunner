'use strict';

var CHASER_SIZE = .7;
var CHASER_MOVE_SPEED = 2;
var CHASER_COLLISION_DISTANCE = .1;
var CHASER_WARMUP = 20*1000;

function Chaser(x, y, color, drift){
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
	this.pathTimer = 0;
	this.drift = Math.pow(drift, 2);

	this.warmup = CHASER_WARMUP;
}

Chaser.prototype.newPath = function(){
	this.path = [];
	var tx = Math.floor(player.x) + (Math.floor(Math.random() * (this.drift*2 + 1)) - this.drift);
	if(tx < 0){
		tx = 0;
	}else if(tx >= maze.width){
		tx = maze.width - 1;
	}
	var ty = Math.floor(player.y) + (Math.floor(Math.random() * (this.drift*2 + 1)) - this.drift);
	if(ty < 0){
		ty = 0;
	}else if(ty >= maze.height){
		ty = maze.height - 1;
	}
	var dijkstra = new ROT.Path.Dijkstra(tx, ty, function(x, y){
		try{
			return !maze.map[x][y];
		}catch(e){
			return false;
		}
	}, {topology: 4});
	dijkstra.compute(this.x, this.y, function(x, y){
		var step = {x: x, y: y};
		this.path.push(step);
	}.bind(this));
}

Chaser.prototype.nextStep = function(){
	if((Math.abs(this.x - player.x) <= 1 && this.y === player.y)
			|| (Math.abs(this.y - player.y) <= 1 && this.x === player.x)){
		this.targetX = Math.floor(player.x);
		this.targetY = Math.floor(player.y);
		return;
	}

	var step = this.path.shift();
	if(step){
		this.targetX = step.x;
		this.targetY = step.y;
	}else{
		this.newPath();
	}
}

Chaser.prototype.update = function(delta){
	if(this.warmup >= 0){
		this.warmup -= delta;
		return;
	}
	console.log('in');
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

	if(Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2)) < CHASER_COLLISION_DISTANCE && !player.caught){
		alert('You have been caught!');
		socket.emit('new');
		player.caught = true;
	}else{
		console.log(Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2)) < CHASER_COLLISION_DISTANCE)
	}
	console.log('out');
}
