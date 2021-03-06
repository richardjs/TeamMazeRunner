'use strict';

// Global components
window.scene = null;
window.camera = null;
window.renderer = null;
window.maze = null;
window.player = null;
window.chasers = [];
window.goals = [];
window.controller = null;
window.render = null;
window.socket = null;

socket = io();

socket.on('reset', function(){
	console.log('resetting');
	window.location.reload();
});

socket.on('maze data', function(maze){
	window.maze = maze;

	// Init display stuff
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, .1, 1000);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// Add lighting
	var ambientLight = new THREE.AmbientLight(0x333333);
	scene.add(ambientLight);
	var pointLight = new THREE.PointLight(0xaaaaaa);
	pointLight.position.set(0, 0, 10);
	scene.add(pointLight);

	// Create floor
	scene.floor = new THREE.Mesh(
		new THREE.PlaneGeometry(maze.width, maze.height),
		new THREE.MeshLambertMaterial({
			color: 0xdddddd,
		})
	);
	scene.add(scene.floor);
	
	// Add walls
	for(var x = 0; x < maze.width; x++){
		for(var y = 0; y < maze.height; y++){
			if(maze.map[x][y]){
				var box = new THREE.Mesh(
					new THREE.BoxGeometry(1, 1, 1),
					new THREE.MeshLambertMaterial({
						color: 0x5577aa
					})
				);

				box.position.x = x - maze.width/2 + .5;
				box.position.y = y - maze.height/2 + .5;
				box.position.z = .5;

				scene.add(box);
			}
		}
	}

	// Add chasers
	for(var i = 0; i < maze.chaserStarts.length; i++){
		chasers.push(new Chaser(maze.chaserStarts[i].x, maze.chaserStarts[i].y, maze.chaserColors[i], i));
	}

	// Add goals
	for(var i = 0; i < maze.goalLocations.length; i++){
		goals.push(new Goal(maze.goalLocations[i].x, maze.goalLocations[i].y));
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

			if(player.caught){
				return;
			}

			player.update(delta);
			socket.emit('player update', player);

			var chaserCoords = [];
			for(var i = 0; i < chasers.length; i++){
				chasers[i].update(delta);
				chaserCoords.push({x: chasers[i].mesh.position.x, y: chasers[i].mesh.position.y});
			}
			socket.emit('chasers update', chaserCoords);

			for(var i = 0; i < goals.length; i++){
				goals[i].update(delta);
			}

			camera.position.x = player.x - maze.width/2 + .5;
			camera.position.y = player.y - maze.height/2 + .5;
			camera.rotation.y = player.angle;
			renderer.render(scene, camera);

			requestAnimationFrame(render);
		}
	}else if(role === 'helper'){
		camera = new THREE.OrthographicCamera(window.innerWidth/-30, window.innerWidth/30, window.innerHeight/30, window.innerHeight/-30, 0, 1000);
		camera.position.z = HELPER_HEIGHT;
		camera.lookAt(scene.floor.position);

		scene.runner = new THREE.Mesh(
			new THREE.CylinderGeometry(0, .33, 1, 4, 4),
			new THREE.MeshPhongMaterial({
				color: 0x00ff00
			})
		);
		scene.add(scene.runner);

		socket.on('runner update', function(runner){
			scene.runner.position.x = runner.x - maze.width/2 + .5;
			scene.runner.position.y = runner.y - maze.height/2 + .5;
			scene.runner.rotation.z = runner.angle;
		});

		socket.on('chasers update', function(chaserCoords){
			for(var i = 0; i < chasers.length; i++){
				chasers[i].mesh.position.x = chaserCoords[i].x;
				chasers[i].mesh.position.y = chaserCoords[i].y;
			}
		});

		socket.on('remove goal', function(goal){
			for(var i = 0; i < goals.length; i++){
				if(goals[i].x === goal.x && goals[i].y === goal.y){
					scene.remove(goals[i].mesh);
				}
			}
		});

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
