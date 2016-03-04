var platform = require('../platform.js');

var express = require('express');       // call express
var app = express();                // define our app using express
var server = require('http').Server(app);
var sio = require('socket.io')(server);
var path = require('path');
//var tmp = require('stake');

var users = [];
var agents = [];
map = new Object();
var buildings = [];
var time = 0;
var Num = 0;

var initMap = function() {
    map.width = 1366;
    map.height = 643;
}

var freshTime = function() {
    time++;
    for(var pos in users)
    {
        var user = users[pos];
        user.emit('freshtime', time);
    };
}

exports.initSystem = function() {
    
    //stake.init();

    

    var port = 8080;
    server.listen(port);

    app.use("/", express.static(path.join(__dirname,'../site/')));

    console.log('运行在端口:' + port);
    sio.sockets.on('connection', function (client) {

        users.push(client);
        initMap();
        console.log('用户已经连接');
        client.emit('map', map);
        /*client.on('time', function(clock) {
            initTime(clock);
        });
        client.on('scene', function(scene) {
            initBuilding(scene);
            client.emit('buildings', buildings);
        });
        client.on('agentNum', function(agentNum) {
            Num = agentNum;
            initAgent();
            console.log(agentNum);
        });
        */ 
        client.on('init', function(scene, agentNum, clockin, clockout) {
            var dt1 = clockin.split(':');
            var time_in = parseInt(dt1[0]) * 3600 + parseInt(dt1[1]) * 60;
            var dt2 = clockout.split(':');
            var time_out = parseInt(dt2[0]) * 3600 + parseInt(dt2[1]) * 60;
            var paras = {homeX:parseInt(scene.homeX),homeY:parseInt(scene.homeY),homeR:40,
                         officeX:parseInt(scene.officeX),officeY:parseInt(scene.officeY),officeR:40,
                         nums:parseInt(agentNum),t_gotoOffice:time_in,t_goHome:time_out};
            platform.init(paras);
            //initBuilding(scene);
            client.emit('buildings', buildings);
            platform.run();
        });
        client.on('start', function() {
            platform.run();
        });
        client.on('pause', function() {
            console.log("yeah");
            platform.suspend();
        });
        /*client.on('clickID', function (agentID) {
            console.log(agentID);
            for(var agent in agents)
            {
                if(agent.id == agentID)
                {
                    agents.splice(agents.indexOf(agent), 1);
                    agent.r = agent.r * 2;
                    agents.push(agent);
                }    
            }
            console.log('尝试点击');
           
            for(var pos in users)
            {
                var user = users[pos];
                user.emit('agents', agents);
            }
        });*/

        //When this client disconnects
        client.on('disconnect', function () {
            users.splice(users.indexOf(client), 1);
            console.log('用户已经断开');
        }); //client.on disconnect

    }); //sio.sockets.on connection
}

var initList = function(agentslist) {
    agents.length = 0;
    var temp;
    for (var i = 0; i < agentslist.length; i++) {
        agent = new Object(),
        temp = agentslist[i],
        agent.id = temp.id,
        agent.x = temp.x,
        agent.y = temp.y,
        agent.r = 5,
        agents.push(agent)
    };
    //temp.r = 5;
    //agents.push(temp);
}

exports.render = function(agentslist, cur_time) {
    initList(agentslist);
    //console.log(agentslist.length);
    
     for(var pos in users) 
     {
        //console.log("send to user");
        var user = users[pos];
        user.emit('agents', agents, cur_time);
                //user.emit('currentTime', currentTime);
    }
}