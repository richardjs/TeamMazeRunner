'use strict';

function Controller(){
	document.body.addEventListener('keydown', function(event){
		switch(event.keyCode){
			case 37:
				this.left = true;
				player.left();
				break;
			case 39:
				this.right = true;
				player.right();
				break;
			case 38:
				this.up = true;
				player.up();
				break;
			case 40:
				this.down = true;
				player.down();
				break;
			default:
				var notUsed = true;
		}
		if(!notUsed){
			event.preventDefault();
		}
	}.bind(this));
	document.body.addEventListener('keyup', function(event){
		switch(event.keyCode){
			case 37:
				this.left = false;
				break;
			case 39:
				this.right = false;
				break;
			case 38:
				this.up = false;
				break;
			case 40:
				this.down = false;
				break;
		}
	}.bind(this));
}
