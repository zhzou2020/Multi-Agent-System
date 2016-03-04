/**
***cur_state indicate what is the agent doing now. like: SLEEP,IN_HOME,GOTO_WORK,WORKING,GO_HOME 
***five states.
***作为一个agent， 具备自主性，不提供调用接口，即agent内部状况不能由外部直接控制。
**/
var Status = require('./statusModel');
var Action_Descripts = require('./NameDefine').ACTION_DESCRIPTIONS;
var State_Type = require('./NameDefine').STATE_TYPE;
var Lib = require('./sharedLib');
function Agent(_id,_homeLoc,_officeLoc,_cur_state,_habit){
	this.aid = _id;
	this.home = _homeLoc;//[x,y]
	this.office = _officeLoc;//[x,y]
	this.cur_state = _cur_state;//STATE_TYPE.?
	this.Sender = require("./Communicator/Sender");
	this.V = 8;
	this.memory = new Status();
	for(var key in _habit){
		this.memory.setStatus(key,_habit[key]);
	}
}
//浅拷贝，因为外部无法改变内部变量，无需深度复制。
Agent.prototype.clone = function(){
	return this;
}
//这两个方法是为了维护数据。与agent特性无关。
Agent.prototype.getID = function(){
	return this.aid;
}

Agent.prototype.notify = function(message){
	//
	//console.log("handle input message!!!");
	if(message == "thinking"){
		this.action_think();
		return;
	}

	switch(parseInt(message)){
		case Action_Descripts.GET_UP:
		this.action_getUp();
		break;
		case Action_Descripts.GOTO_OFFICE:
		this.action_gotoOffice();
		break;
		case Action_Descripts.GO_HOME:
		this.action_goHome();
		break;
		case Action_Descripts.GOTO_BED:
		this.action_sleep();
		break;
		default:
		console.log(message);
		console.log("error in Agent.notify!!!");
		break;
	}
}

Agent.prototype.action_sleep = function(){//睡觉
	this.cur_state = State_Type.SLEEP;
	console.log('sleeping!!!!!');
	var description={
					 "actionName":"sleep",
   					 "paras":null
    				};

    var des_str=JSON.stringify(description);
    this.Sender.submitAction(this.aid,des_str);
}


Agent.prototype.action_gotoOffice = function(){//去上班
	this.cur_state = State_Type.GOTO_WORK;
	//建立move动作。首先远程调用平台的感知方法see();周围agent的位置和自己的当前位置。
	var funcName = "see";
	var paras = [];
	var agentMap = this.Sender.rpcRequest(this.aid,funcName,paras);//需要同步得到结果。
	//console.log(agentMap);
	var cur_loc = agentMap[this.aid];
	delete agentMap[this.aid];
	var v = this.V;
	console.log(this.aid+" go to office");
	console.log(agentMap);

	//call getVelocity() function in sharedLib.js
	var velocity = Lib.getVelocity(agentMap,cur_loc,this.office,v,this.aid);
	console.log("velocity:"+velocity);
	var description=
   {
   	"actionName":"move",
   	"paras":velocity
   };

    var des_str=JSON.stringify(description);
    this.Sender.submitAction(this.aid,des_str);
}

Agent.prototype.action_goHome = function(){//下班
	this.cur_state = State_Type.GO_HOME;

	var funcName = "see";
	var paras = [];
	var agentMap = this.Sender.rpcRequest(this.aid,funcName,paras);//需要同步得到结果。
	//console.log(agentMap);
	var cur_loc = agentMap[this.aid];
	delete agentMap[this.aid];
	var v = this.V;

	var velocity = Lib.getVelocity(agentMap,cur_loc,this.home,v,this.aid);
	var description=
    {
   	"actionName":"move",
   	"paras":velocity
    };

    var des_str=JSON.stringify(description);
    this.Sender.submitAction(this.aid,des_str);
}

Agent.prototype.action_getUp = function(){//起床
	this.cur_state = State_Type.IN_HOME;  
	console.log('get_up');
	var description=
   {
   	"actionName":'get_up',
   	"paras":null
   };
	var des_str=JSON.stringify(description);
    this.Sender.submitAction(this.aid,des_str);
}

Agent.prototype.action_think = function(){
	switch(this.cur_state){
		case State_Type.GOTO_WORK:
		var funcName = "see";
		var paras = [];
		var agentMap = this.Sender.rpcRequest(this.aid,funcName,paras);

		var cur_loc = agentMap[this.aid];
		delete agentMap[this.aid];
		var v = this.V;

		var office_loc = this.office;
		var distant=Math.sqrt(Math.pow(cur_loc[0]-office_loc[0],2)+Math.pow(cur_loc[1]-office_loc[1],2));
		if (distant <= 10) //10为目标office的偏差范围
		{
			console.log(this.aid + " arrives at OFFICE!");
			this.cur_state = State_Type.WORKING;
        }else{
        	var velocity = Lib.getVelocity(agentMap,cur_loc,this.office,v,this.aid);
			var description=
   			{
   			"actionName":"move",
   			"paras":velocity
   			};

    		var des_str=JSON.stringify(description);
    		this.Sender.submitAction(this.aid,des_str);
    	}
		break;

		case State_Type.GO_HOME:
		var funcName = "see";
		var paras = [];
		var agentMap = this.Sender.rpcRequest(this.aid,funcName,paras);

		var cur_loc = agentMap[this.aid];
		delete agentMap[this.aid];
		var v = this.V;

		var home_loc=this.home;
		var distant=Math.sqrt(Math.pow(cur_loc[0]-home_loc[0],2)+Math.pow(cur_loc[1]-home_loc[1],2));
		if (distant <= 10) //10为目标home的偏差范围
		{
			console.log(this.aid + " arrives at HOME!!!");
	     	this.cur_state = State_Type.IN_HOME;
        }else{
        	var velocity = Lib.getVelocity(agentMap,cur_loc,this.home,v,this.aid);
			var description=
    		{
   			"actionName":"move",
   			"paras":velocity
    		};

    		var des_str=JSON.stringify(description);
    		this.Sender.submitAction(this.aid,des_str);
        }
		break;

		case State_Type.IN_HOME:

		break;
		
		case State_Type.WORKING:
		//in working move based on relationships
		var funcName = "see";
		var paras = [];
		var agentMap = this.Sender.rpcRequest(this.aid,funcName,paras);

		var cur_loc = agentMap[this.aid];
		delete agentMap[this.aid];
		var v = this.V;

		var velocity = Lib.getVelocity(agentMap,cur_loc,this.office,v,this.aid);
		var description=
   		{
   		"actionName":"move",
   		"paras":velocity
   		};

    	var des_str=JSON.stringify(description);
    	this.Sender.submitAction(this.aid,des_str);

		break;
	}

}

module.exports = Agent;