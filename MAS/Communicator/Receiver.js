var Action = require("../model/Action");

exports.receive = function(msge){
	var message = msge.split(";");
	var type = message[2];
	switch(type){
		case  "RPCRequest":
		var data = message[3];
		var rpc = data.split("|");
		var funcName = rpc[0];
		var paras = rpc[1].split(",");
		//call function by funcName.and 调用rpcResponse返回结果(<funcName|result>)。
		break;
		case "ActionSubmit":
		var a_id = message[0];
		var action_descript = message[3];
		//把action_descript 加入到a_id的agent的agentList中。
		var action_content = JSON.parse(action_descript);
		var action_id = action_content.actionName;
        var action_paras = action_content.paras;

		var newAction = new Action(action_id,action_paras);
		var actor_list = ENV.getActorList();
		var actor = actor_list.getAgent(a_id);
		actor.exec(newAction);
		break;
		default:
		console.log("in platform.receiver, a unknown type!!");
		break;
	}
}