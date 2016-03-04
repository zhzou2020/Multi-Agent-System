var agentMap = {};

exports.addAgent = function(agent){
	var id = agent.getID();
	if(agentMap[id])
		return false;
	agentMap[id] = agent;
	return true;
}

exports.receive = function(msge){
	var tuple = msge.split(";");
	//console.log(msge);
	//console.log(tuple);
	var type = tuple[2];
	switch(type){
		case "RPCResponse":
		var result = tuple[3];
		//do some operations.
		break;
		case "Unicast":
		var information = tuple[3];
		var d_id = tuple[1];
		var agent = agentMap[d_id];
		//console.log(d_id);
		//console.log(information);
		//console.log(agent.getID());
		agent.notify(information);
		//doing some operations.
		break;
		default:
		console.log("in Agent.recevier. a unkonwn type!!");
		break;
	}
}
