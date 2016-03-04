//获得初始agent信息。
/**
*** 调用初始化方法得到初始信息，然后生成Agent/Scene初始化定义文件agent_define.xml
**/
var Receiver = require('./Communicator/Receiver');
var Lib = require('./sharedLib');
var AgentInit = require('./agentInit');
var State_type = require('./NameDefine').STATE_TYPE;
var Action_Descripts = require('./NameDefine').ACTION_DESCRIPTIONS;
var Agent = require('./Agent');
var path = require('path');

exports.init = function(paras){
//...................
    if(!paras.homeX || !paras.homeY || !paras.homeR || !paras.officeX || !paras.officeY 
    || !paras.officeR || !paras.nums || !paras.t_gotoOffice || !paras.t_goHome){
        console.log("paras参数格式错误，请参考文档《server级别界面和架构的交互》！");
        throw "Error!"+__dirname+"/Init.js";
    }
    
    var homeX = paras.homeX;
    var homeY = paras.homeY;
    var homeRadius = paras.homeR;
    var officeX = paras.officeX;
    var officeY = paras.officeY;
    var officeRadius = paras.officeR;
    var num = paras.nums;
    var leaveHomeTime = paras.t_gotoOffice;
    var offWorkTime = paras.t_goHome;

    var actor_list = [];//{id:?,x:?,y:?,address:?}
    var scene_map = {};
    var scene_id = 0;
    scene_map[scene_id] = [];
    var cue_actions = scene_map[scene_id];//[cue,action_descript,id]

    var id_list = Lib.getAgentIDList(num);
    
    var social_net = getSocialNetwork(id_list);
    Lib.setSocialNetwork(social_net);

    var list = AgentInit.getInitAgents(homeX,homeY,homeRadius,officeX,officeY,officeRadius,num);
    var i = 0;
    for(var index in list){
        var data = list[index];
        
        var local = [data[0],data[1]];
        var getUpTime = data[4];
        var sleepTime = data[5];

        var homeLoc = [data[0],data[1]];
        var officeLoc = [data[2],data[3]];
        var aid = id_list[i];
        var cur_state = State_type.SLEEP;
        var habit = {'WakeUpTime':getUpTime,
                     'LeaveHomeTime':leaveHomeTime,
                     'OffWorkTime':offWorkTime,
                     'BedTime':sleepTime};
        i++;

        var agent = new Agent(aid,homeLoc,officeLoc,cur_state,habit);
        Receiver.addAgent(agent);
        //生成agent_define.xml文件。

        var actor = {'id':aid,'x':local[0],'y':local[1],'address':aid};
        actor_list.push(actor);
        //生成场景内容（各场景及相关cue--actions)

        cue_actions.push([getUpTime,Action_Descripts.GET_UP,aid]);
        cue_actions.push([leaveHomeTime,Action_Descripts.GOTO_OFFICE,aid]);
        cue_actions.push([offWorkTime,Action_Descripts.GO_HOME,aid]);
        cue_actions.push([sleepTime,Action_Descripts.GOTO_BED,aid]);
    }

    var result = {'actor_list':actor_list,'scene_map':scene_map};
    return result;
}

function getSocialNetwork(id_list){
    var getData = require('./udb');
    var data = getData();
    var map = {};

    for(var i in id_list){
        var id = id_list[i];
        map[id] = data[id];
        console.log(id+":"+data[id]);
    }

    return map;
}
