
function Action(_id,_paras){
	this.id = _id;
	this.paras = _paras;
}

Action.prototype.clone = function(){
	var duplicate = new Action(this.id,this.paras,this.type);
	return duplicate;
}

Action.prototype.getParameters = function(){
	return this.paras;
}

Action.prototype.getIdentifier = function(){
	return this.id;
}


module.exports = Action;