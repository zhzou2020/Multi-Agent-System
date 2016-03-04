var server = require('server.js');
var agents = [];
var cur_time = 0;


export.init = function (homeX,homeY,homeR,officeX,officeY,officeR,agentNums,clockin,clockout) {

}

var initAgent = function(agentNums) {
		for (var i = 1; i <= agentNums; i++) {
        agent = new Object(),
        agent.id = i,
        agent.x = i*10,
        agent.y = i*10,
        agent.r = 5,
        agents.push(agent)
    };
}
var initBuilding = function() {   
    building1 = new Object(),
    building1.id = 1,
    building1.x = 20,
    building1.y = 20,
    building1.r = 80,
    buildings.push(building1);

    building2 = new Object(),
    building2.id = 2,
    building2.x = 500,
    building2.y = 300,
    building2.r = 80,
    buildings.push(building2);

    map.width = 800;
    map.height = 500;
    return
    {
    	buildings: buildings,
    	map: map
}
var start = function() {

}

var pause = function() {

}   

var stop = function() {
	
}

var interval = function() {
    cur_time++;
    window.setTimeout("Scroll()", 1000);
}

var Scroll = function() {

}