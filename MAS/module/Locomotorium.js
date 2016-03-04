/** 
***@description: a locomotorium for a actor. actor is a representor in platform for a agent.
**/
function Locomotorium(_actor){
	this.actor = _actor;
}

Locomotorium.prototype.clone = function(){
	var duplicate = new Locomotorium(this.actor);
	return duplicate;
}

Locomotorium.prototype.get_up = function(){
	console.log(ENV.getCurrentTime() + ": " + this.actor.id+"is get up now!!");
}

Locomotorium.prototype.move = function(paras){
	console.log(paras);
	this.actor.x += paras[0];
	this.actor.y += paras[1];
	console.log(ENV.getCurrentTime() + ": " 
		+this.actor.id +' now is at '+this.actor.x + ","+this.actor.y);
}

Locomotorium.prototype.sleep = function(){
	console.log(ENV.getCurrentTime() + ": " +this.actor.id+" is going to sleep!!!");
}


module.exports = Locomotorium;