'use strict';

var CHASER_SIZE = .7;

function Chaser(x, y, color){
	this.x = x;
	this.y = y;

	this.mesh = new THREE.Mesh(
		new THREE.BoxGeometry(CHASER_SIZE, CHASER_SIZE, CHASER_SIZE),
		new THREE.MeshPhongMaterial({
			color: color,
		})
	);
	this.mesh.position.x = x - maze.width/2 + .5;
	this.mesh.position.y = y - maze.height/2 + .5;
	this.mesh.position.z = .5;
	scene.add(this.mesh);
}
