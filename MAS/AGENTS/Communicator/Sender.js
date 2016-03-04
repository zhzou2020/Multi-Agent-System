//通信报文采取格式：<source;destination;type;data>
//可以支撑所有agent之间通信情况。
//目前来看type主要分为以下几类：RPCRequest,	RPCResponse,
//Unicast,Multicast,ActionSubmit。
//广播是目标为所有agent的组播。
//对于RPCRequest，data部分还分为函数名和参数。
//格式：<functiionName|para1,para2,para3...>
//用不同的符号隔离，易于分开。
//action 描述： <id|para1,para2..>
var sendMessage= function(dest,msge){
	if (dest == "platform") {
		var platformReceiver = require("../../Communicator/Receiver");
		platformReceiver.receive(msge);
	}else{
		var agentReceiver = require("./Receiver");
		agentReceiver.receive(msge);
	}
}//send message function concrete

exports.rpcRequest = function(src,funcName,paras){
    //如何实现RPC？？？？
    var actor_list = ENV.getActorList();
    var actor = actor_list.getAgent(src);
    var response = actor.percept(funcName,paras);
    //console.log(response);
    return response;
	// var sent = src+";"+"platform"+";RPCRequest;";
	// sent += funcName+"|"+paras.join(",");

	// var platformReceiver = require("../../Communicator/Receiver");
	// var response = platformReceiver.receive(msge);
}

exports.submitAction =  function(src,actionDescript){
	var sent = src+";"+"platform"+";ActionSubmit;";
	sent += actionDescript;//看传入的是什么再再来改。
	sendMessage("platform",sent);
}

exports.actionRemove = function(src,dest,action_id){
	var sent = src+";"+"dest"+";ActionRemove"+action_id;
	sendMessage(dest,sent);
}

exports.unicast = function(src,dest,information){
	var sent = src+";"+dest+";Unicast;"+information;
	sendMessage(dest,sent);
}

exports.Multicast = function(src,dest,information){
	for(var i = 0; i < dest.length ; i++){
		var id = dest[i];
		this.unicast(src,id,information);
	}
}