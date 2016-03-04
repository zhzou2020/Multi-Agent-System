//
var AgentList = require('./DataStructure/AgentList');
var Actor = require('./model/Actor');
var Scene = require('./Scenario/scene');
function Environment(){
    this.times = require('./model/Time');
    this.scenario_map = {};
    this.actor_list = new AgentList();
    this.cur_scene = 0;
}

Environment.prototype.getActorList = function(){
    return this.actor_list;
}

Environment.prototype.getScene = function(){
    return this.scenario_map[this.cur_scene];
}

Environment.prototype.gotoScene = function(sid){
    this.cur_scene = sid;
}

Environment.prototype.restore = function(){
    this.times.restore();
    this.scenario_map = {};
    this.actor_list = new AgentList();
    this.cur_scene = 0;
}

Environment.prototype.getCurState = function(){
    return this.times.getMilliseconds();
}

Environment.prototype.getCurrentTime = function(){
    return this.times.getCurrentTime();
}

Environment.prototype.increTime = function(){
    return this.times.increTime();
}
/**
*** list is a list of {id:?,x:?,y:?,address:?}
**/
Environment.prototype.initActorList = function(list){
    for(var i in list){
        var map = list[i];
        var aid = map.id;
        var x = map.x;
        var y = map.y;
        var address = map.address;
        var actor = new Actor(aid,x,y,address);
        this.actor_list.add(actor);
    }
}
//map is {sid:{[cue,action,id],...},...}
Environment.prototype.initScenes = function(map){
    for(var key in map){
        var sid = key;
        var data_list = map[key];
        for(var i in data_list){
            var data = data_list[i];
            var cue = data[0];
            var action_descript = data[1];
            var aid = data[2];
            if(this.scenario_map[sid]){
                this.scenario_map[sid].add(cue,aid,action_descript);
            }else{
                var scene = new Scene(sid);
                scene.add(cue,aid,action_descript);
                this.scenario_map[sid] = scene;
            }
        }
    }
    //console.log(this.scenario_map[0]);
}

module.exports = Environment;