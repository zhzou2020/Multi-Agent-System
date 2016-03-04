var Environment = require('./Environment');
var AgentList = require("./DataStructure/AgentList");
var Scene = require("./Scenario/scene");
var Sender = require("./Communicator/Sender");
var drawPlane = require("./server/server.js");
var path = require('path');

global.ENV = new Environment();

var uniteTime = 5;
var agentPath = "";
var agentInit = null;
var timeID = null;

var notifyPlane = function(){
    var paintAgents = [];
    var list = ENV.getActorList().toArray();
    //console.log(list);
    for(var index in list){
        var agent = list[index];
        //console.log(index);
        var notifyObj = {id:agent.getID(),x:agent.getX(),y:agent.getY()};

        paintAgents.push(notifyObj);
    }

    var current_time = ENV.getCurState();
    //console.log(paintAgents);
    drawPlane.render(paintAgents,current_time);
}

//Platform running cycle.
var executeProc = function(){
    
	//check all the cues to motivate the agents' actions
    var scene = ENV.getScene();
    //console.log(scene);
    var curState = ENV.getCurState();//get milliseconds
    var checkResults = scene.get(curState);//console.log("checkResults:"+checkResults+"\n");
    if(checkResults != null){
        for(var key in checkResults){
            var msge = key;
            var a_ids = checkResults[key];
            
            for(var i in a_ids){
                var dest = a_ids[i];
                Sender.unicast(dest,msge)
            }
        }
    }
    //publish('thinking');
    var actor_list = ENV.getActorList();
    var aidList = actor_list.getAllIDs();
    //console.log("aidList:"+aidList);
    Sender.multicast(aidList,"thinking");
    console.log(ENV.getCurrentTime());
    
    //notify agents
    notifyPlane();
    //count time.
	ENV.increTime();
}//running body.


//initial circumstances and agents information.
//getInitValue(20.0) and create agents based on these information.listen the message from agents.
exports.init = function(paras){
    if(agentInit == null){
        throw "agentInit is null!!!";
    }
    console.log('init agents begin!');
    console.log(paras);
    var data = agentInit.init(paras);
    console.log('init agents over!');

    var fileName = path.join("AGENTS",'agent_define.txt');
    console.log(fileName);
        // console.log('actor list:');
        //console.log(temp[0]);
        // console.log('secene list:');
        // console.log(temp[1]);

    var actor_list = data['actor_list'];
    var scene_map = data['scene_map'];

    ENV.restore();
    ENV.initActorList(actor_list);
    ENV.initScenes(scene_map);

}
//running the platform.incorporate temperol order.

exports.run = function(){
    timeID = setInterval(executeProc, uniteTime);
}

exports.suspend = function(){
    if(timeID == null){
        console.log("you must run first!!!");
        return;
    }
    clearInterval(timeID);
}

function main(path){
    agentPath = path;
    drawPlane.initSystem();
    agentInit = require(agentPath+"/Init");
}


//run main......   how to realize command.....
main(path.resolve("./AGENTS"));

// var paras = {homeX:100,homeY:200,homeR:40,
//                          officeX:900,officeY:1000,officeR:40,
//                          nums:5,t_gotoOffice:31800,t_goHome:61200};
// exports.init(paras);
// exports.run();
