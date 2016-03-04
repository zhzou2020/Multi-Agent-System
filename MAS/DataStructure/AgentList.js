/**store all of the agents' information. like}{id,information}。platform only know the information,but 
***don't konw what is the information mean.namely, all the information exclude id of agent are 
***included in 'information' above.
**/
function AgentList(_list){
	if(!_list)
		_list = [];
	this.map = {};
	for(var i in _list){
		var agent = _list[i];
		var a_id = agent.getID();
		this.map[a_id] = agent;
	}
}

AgentList.prototype.clone = function(){
	var temp_list = [];
	for(var key in this.map){
		var agent = this.map[key];
		temp_list.push(agent.clone());
	}

	var duplicate = new AgentList(temp_list);
	return duplicate;
}

AgentList.prototype.add = function(agent){
    var a_id = agent.getID();
    if(this.map[a_id])
    	return false;
    
    this.map[a_id] = agent;
    return true;
}

AgentList.prototype.remove = function(agent){
	var a_id = agent.getID();
	if(!this.map[a_id])
		return false;

	delete this.map[a_id];
	return true;
}

AgentList.prototype.contain = function(id){
	if(this.map[id])
		return true;
	return false;
}

AgentList.prototype.len = function(){
	var num = 0;
	for(var key in this.map){
		num++;
	}

	return num;
}

AgentList.prototype.getAgent = function(id){
	var agent = this.map[id];
	return agent.clone();
}

AgentList.prototype.toArray = function(){
	var rs = [];
	for(var key in this.map){
		var agent = this.map[key];
		rs.push(agent.clone());//对象的副本，深层复制。
	}

	return rs;
}

AgentList.prototype.getAllIDs = function(){
	var rs = [];
	for(var key in this.map){
		rs.push(key);
	}

	return rs;
}

module.exports = AgentList;