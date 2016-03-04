/**
***@author XiaChenhui
***@description: a receptor for a actor. actor is a representor in platform for a agent.
**/
var behaviors = require('../behaviors');
function Receptor(_actor){
	this.actor = _actor;
}

Receptor.prototype.clone = function(){
	var duplicate = new Receptor(this.actor);
	return duplicate;
}

Receptor.prototype.see = function(){
	console.log(this.actor.id + ' is seeing--------');
	var list = ENV.getActorList();
	return behaviors.observe(this.actor,list);

}

module.exports = Receptor;