var Receptor = require('../module/Receptor');
var Locomotorium = require('../module/Locomotorium');
var ActionList = require('../DataStructure/ActionList');
/**
*** a representor of agent in platform. assemble agent must have a getID() function.
**/
function Actor(_id,_x,_y,_address,_receptor,_locomotorium){
	this.id = _id;
	this.x = _x;
	this.y = _y;
	this.address = _address;
	if(!_receptor)
		_receptor = new Receptor(this);
	if(!_locomotorium)
		_locomotorium = new Locomotorium(this);
	this.receptor = _receptor;
	this.locomotorium = _locomotorium;
	this.action_list = new ActionList//create a actionlist
}
/**
*** funcName is a String. and paras is [para1,para2...]
**/
Actor.prototype.percept = function(funcName,paras){
	//console.log(funcName+" percept");
	var str = "this.receptor."+funcName+"("+JSON.stringify(paras)+")";
	//console.log(str);
	var data = eval(str);
	//console.log(data);
	return data;
}

Actor.prototype.exec = function(action){
	var actionName = action.getIdentifier();
	var paras = action.getParameters();
	var str = "this.locomotorium."+actionName+"("+JSON.stringify(paras)+")";
	var result = eval(str);
}

Actor.prototype.getID = function(){
	return this.id;
}

Actor.prototype.getX = function(){
	return this.x;
}

Actor.prototype.getY = function(){
	return this.y;
}

Actor.prototype.getAddress = function(){
	return this.address;
}

Actor.prototype.clone = function(){
	var duplicate = new Actor(this.id,this.x,this.y,this.address,this.receptor,this.locomotorium);
	return duplicate;
}

module.exports = Actor;

