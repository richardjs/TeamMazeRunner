'use strict';

function Player(x, y){
	this.x = x;
	this.y = y;
	this.angle = 0;
	this.targetX = x;
	this.targetY = y;
	this.targetAngle = this.angle;
}

Player.prototype.isTurning = function(){
	return this.angle !== this.targetAngle;
}

Player.prototype.isMoving = function(){
	return this.x !== this.targetX || this.y !== this.targetY;
}

Player.prototype.update = function(delta){
	if(this.isTurning()){
		var turnDistance = PLAYER_TURN_SPEED * delta / 1000;
		if(Math.abs(this.angle - this.targetAngle) < turnDistance){
			this.angle = this.targetAngle;
			while(this.angle < 0){
				this.angle += Math.PI*2;
			}
			if(this.angle >= Math.PI*2){
				console.log('reducing');
				this.angle %= Math.PI*2;
			}
			this.targetAngle = this.angle;
		}else if(this.angle < this.targetAngle){
			this.angle += turnDistance;
		}else{
			this.angle -= turnDistance;
		}
	}else if(this.isMoving()){
		var moveDistance = PLAYER_MOVE_SPEED * delta / 1000;
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

		if(!this.isMoving() && controller.up){
			this.up();
		}
	}
}

Player.prototype.left = function(){
	if(this.isTurning() || this.isMoving()){
		return;
	}
	this.targetAngle += Math.PI/2;
	console.log('target angle: ' + this.targetAngle);
}

Player.prototype.right = function(){
	if(this.isTurning() || this.isMoving()){
		return;
	}
	this.targetAngle -= Math.PI/2;
	console.log('target angle: ' + this.targetAngle);
}

Player.prototype.up = function(){
	if(this.isMoving()){
		return false;
	}
	switch(this.angle){
		case Math.PI*0:
			this.tryMoveTo(this.x, this.y+1);
			break;
		case Math.PI*.5:
			this.tryMoveTo(this.x-1, this.y);
			break;
		case Math.PI*1:
			this.tryMoveTo(this.x, this.y-1);
			break;
		case Math.PI*1.5:
			this.tryMoveTo(this.x+1, this.y);
			break;
	}
}

Player.prototype.tryMoveTo = function(x, y){
	console.log(x, y);
	if(maze.map[x][y]){
		console.log('wall');
		return;
	}
	this.targetX = x;
	this.targetY = y;
}
