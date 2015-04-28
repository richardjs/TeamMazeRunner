'use strict';

// Global components
window.scene = null;
window.camera = null;
window.renderer = null;
window.maze = null;
window.player = null;
window.controller = null;
window.render = null;
window.socket = null;

socket = io();

socket.on('maze data', function(maze){
	window.maze = maze;

	// Init display stuff
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, .1, 1000);
	//var camera = new THREE.OrthographicCamera(window.innerWidth/-20, window.innerWidth/20, window.innerHeight/20, window.innerHeight/-20, 0, 1000);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// Add lighting
	var ambientLight = new THREE.AmbientLight(0x222222);
	scene.add(ambientLight);
	var pointLight = new THREE.PointLight(0xaaaaaa);
	pointLight.position.set(0, 0, 10);
	scene.add(pointLight);

	// Create floor
	scene.floor = new THREE.Mesh(
		new THREE.PlaneGeometry(maze.width, maze.height),
		new THREE.MeshPhongMaterial({
			color: 0xfffffff,
		})
	);
	scene.add(scene.floor);
	
	// Add walls
	for(var x = 0; x < maze.width; x++){
		for(var y = 0; y < maze.height; y++){
			if(maze.map[x][y]){
				var box = new THREE.Mesh(
					new THREE.BoxGeometry(1, 1, 1),
					new THREE.MeshPhongMaterial({
						color: 0xff0000,
						side: THREE.DoubleSide
					})
				);

				box.position.x = x - maze.width/2 + .5;
				box.position.y = y - maze.height/2 + .5;
				box.position.z = .5;

				scene.add(box);
			}
		}
	}
});

socket.on('role', function(role){
	if(role === 'runner'){
		// Position camera
		camera.position.y = -5;
		camera.position.z = .5;

		player = new Player(maze.start.x, maze.start.y);


		camera.rotation.x = Math.PI/2;

		// Instantiate controller
		controller = new Controller();

		// Main loop
		render = function(time){
			var delta = time - lastTime;
			lastTime = time;

			player.update(delta);

			camera.position.x = player.x - MAZE_WIDTH/2 + .5;
			camera.position.y = player.y - MAZE_HEIGHT/2 + .5;
			camera.rotation.y = player.angle;
			renderer.render(scene, camera);

			requestAnimationFrame(render);
		}
	}else if(role === 'helper'){
		camera.position.z = HELPER_HEIGHT;
		camera.lookAt(scene.floor.position);

		render = function(time){
			var delta = time - lastTime;
			lastTime = time;

			renderer.render(scene, camera);

			requestAnimationFrame(render);
		}
	}
	var lastTime = 0;
	render(0);
});
