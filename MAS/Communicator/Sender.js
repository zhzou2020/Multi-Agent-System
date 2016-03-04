//通信报文采取格式：<source;destination;type;data>
//可以支撑所有agent之间通信情况。
//目前来看type主要分为以下几类：RPCRequest,	RPCResponse,
//Unicast,ActionSubmit,ActionRemove。
//广播是目标为所有agent的组播。组播由单播实现。
var sendMessage= function(msge){
	var agentReceiver = require("../AGENTS/Communicator/Receiver");
	agentReceiver.receive(msge);
}//send message function concrete

exports.rpcResponse = function(dest,result){//dest is agent's id
	var sent = "platform"+";"+dest+";RPCResponse;"+result;
	sendMessage(sent);
}//form a sent message.统一格式


exports.unicast = function(dest,information){
	var sent = "platform"+";"+dest+";Unicast;"+information;
	sendMessage(sent);
}

exports.multicast = function(dest,information){
	//console.log(dest);
	for(var i = 0;i < dest.length ; i++){
		var id = dest[i];
		//console.log(id);
		this.unicast(id,information);
	}
}