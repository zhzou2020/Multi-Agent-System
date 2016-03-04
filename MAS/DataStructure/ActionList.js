
function ActionList(_list){
	if(!_list)
		_list = [];
	this.list = _list;
}

ActionList.prototype.clone = function(){
	var temp_list = new Array(this.list.length);
	for(var index in this.list){
		var action = this.list[index];
		temp_list[index] = action.clone();
	}

	var duplicate = new ActionList(temp_list);
	return duplicate;
}

ActionList.prototype.add = function(action){
	var index = this.contain(action);
	if ( index != -1 ) {//如果已有action描述，则进行更新。没有则添加
		this.list.splice(index,1,action);
	}else{
		this.list.push(action);
	}
}

ActionList.prototype.remove = function(action){
	var index = contain(action);
	if(index == -1){
		return false;
	}

	this.list.splice(index,1);
	return true;
}

ActionList.prototype.removeByid = function(id){
	for(var i = 0 ; i < this.list.length ; i++){
		if(id == this.list[i].getIdentifier()){
			this.list.splice(i,1);
			return true;
		}
	}
	return false;
}

ActionList.prototype.getAction = function(index){
	return this.list[index].clone();
}

ActionList.prototype.len = function(){
	return this.list.length;
}

ActionList.prototype.contain = function(action){//通过id来判断action是否已在列表中。
    for(var i = 0 ; i < this.list.length ; i++){
    	if(action.getIdentifier() == this.list[i].getIdentifier() )
    		return i;
    }	

	return -1;
}

ActionList.prototype.getList = function(){
	var rs = new Array(this.list.length);
	for(var i = 0 ; i < rs.length ; i++){
		rs[i] = this.list[i].clone();
	}
	return rs;
}

module.exports = ActionList;