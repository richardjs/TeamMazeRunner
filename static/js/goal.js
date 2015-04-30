'use strict';

var GOAL_SIZE = .3;

function Goal(x, y){
	this.x = x;
	this.y = y;

	this.mesh = new THREE.Mesh(
		new THREE.SphereGeometry(GOAL_SIZE/2, 30, 30),
		new THREE.MeshPhongMaterial({
			color: 0xffffff,
		})
	);
	this.mesh.position.x = this.x - maze.width/2 + .5;
	this.mesh.position.y = this.y - maze.height/2 + .5;
	this.mesh.position.z = .5;
	scene.add(this.mesh);
}

Goal.prototype.update = function(delta){
	if(Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2)) < GOAL_SIZE/2){
		scene.remove(this.mesh);
		socket.emit('remove goal', this);
		goals.splice(goals.indexOf(this), 1);
		if(goals.length === 0){
			alert('You win!');
			socket.emit('new');
		}
	}
}
