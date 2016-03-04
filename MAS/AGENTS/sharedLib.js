//exports.getVelocity = function(neighbors,subject,destLocal,v,network){
	//.......
//	return getV(neighbors,subject,destLocal,v,network);
//}

var getData = require('./udb');
var data = getData();
var keys = [];
for(var key in data)
	keys.push(key);

var friendGroup = {};
var social_Network = {};

function getVelWithLoc(curLoc,desLoc,k){
	var x=desLoc[0]-curLoc[0];
	var y=desLoc[1]-curLoc[1];
	var length=Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
	return [k*x/length,k*y/length];
}

function getDesVel(curLoc,desLoc,v){
	return getVelWithLoc(curLoc,desLoc,v);
}

//preArr插入前array
//preFound charuqian yizhaodaodeagentid
//insert要插入的数组
//curPri要插入的数组中每个元素的pri
function pushArr(preArr,preFound,insert,curPri){
	var len=insert.length;
	for(var i=0;i<len;i++){
		preArr[insert[i]]=curPri;
		preFound[i]=insert[i];
	}
}

//插入之前没插入过的agent，不包括其本身
function pushArrIfNotExist(preArr,preFound,insert,curPri,id){
	if(!insert)
		return;

	var len=insert.length;
	
	for(var i=0;i<len;i++){
		var curID=insert[i];
		if(curID==id)
			continue;

		var exist=false;
		for(var i in preFound){
			if(preFound[i]==curID){
				exist=true;
				break;
			}
		}

		if(!exist){
			preArr[curID]=curPri;
			preFound.push(curID);
		}
	}

}

//通过socialNetwork得到朋友列表
function getFriendList(socialNetwork,theta,id){//friendGroup的记录有个问题，变量有id,theta两个。

	if(friendGroup[id])
		return friendGroup[id];

	var friendList={};//{id:pri(int)...}
	var friendIDs=[];//{id:isExist(boolean)...}
	pushArr(friendList,friendIDs,socialNetwork[id],1);

	for(var i=0;i<friendIDs.length;i++){
		var friendID=friendIDs[i];
		var pri=friendList[friendID];
		if(pri>=theta)
			break;
		console.log(socialNetwork[friendID]);
		pushArrIfNotExist(friendList,friendIDs,socialNetwork[friendID],pri+1,id);
	}

	friendGroup[id]=friendList;
	return friendList;
}

function arrPlus(arr1,arr2){
	arr1[0]+=arr2[0];
	arr1[1]+=arr2[1];
}

function getSocialBinding(agentList,friendList,curLoc,theta){
	var result=[0,0];

	for(var id in agentList){
		var pri=friendList[id];
		if(!pri)
			continue;
		var agentLoc = agentList[id];
		var k=(theta-pri+1)/theta;//系数
		console.log("k:");
		console.log(k);
		arrPlus(result,getVelWithLoc(agentLoc,curLoc,k));
	}

	return result;
}


function getRandomNum(Min,Max)
{   
	var Range = Max - Min;   
	var Rand = Math.random(); 
	return(Min + Math.floor(Rand * Range));   
}

function merge(IDList,IDMap,insert,curLen,maxLen){
	for(var i=0;i<insert.length&&curLen<maxLen;i++){
		var curID=insert[i];
		if(data[curID]&&!IDMap[curID]){
			IDList.push(curID);
			IDMap[curID]=true;
			++curLen;
		}
	}
}


exports.getVelocity = function(agentList,curLoc,desLoc,v,id){//agentList{id:[x,y]}，socialNetwork{id:[id1,id2...]}
	var theta=2;//theta默认为2
	//console.log(social_Network);
	var arr1=getDesVel(curLoc,desLoc,v);
	console.log("arr1:");
	console.log(arr1);
	var friendList=getFriendList(social_Network,theta,id);
	var arr2=getSocialBinding(agentList,friendList,curLoc,theta);
	console.log("arr2:");
	console.log(arr2);
	arrPlus(arr1,arr2);
	arr1[0]=parseInt(arr1[0]-0.5)+1;//四舍五入
	arr1[1]=parseInt(arr1[1]-0.5)+1;//四舍五入
	return arr1;
}

exports.getAgentIDList = function(num){
	var IDMap={};//便于判断某个ID是否已被添加
	var IDList=[];//存储已被添加的ID
	var total=140882;
	for(var i=0;i<num/3;i++){//3为一比例系数
		while(true){
			var tmp=keys[getRandomNum(0,total)];
			if(!IDMap[tmp]){
				IDMap[tmp]=true;
				IDList.push(tmp);
				break;
			}
		}
	}
	
	for(var i=0;IDList.length<num;i++){
		var insert=data[IDList[i]];
		if(insert)
			merge(IDList,IDMap,insert,IDList.length,num);
	}
	//没朋友了怎么办？bug...
	return IDList;
}

exports.setSocialNetwork = function(map){
	console.log(map);
	social_Network = map;
}

exports.getFriends = function(id){
	return getFriendList(socialNetwork,2,id);
}

/*
var agentList={111:[1,1],
				222:[2,2],
				333:[3,3],
				555:[1,0],
				666:[2,1]};
var curLoc=[0,0];
var desLoc=[10,10];
var v=5;
var socialNetwork={111:[222,444],
					222:[111,666],
					333:[444],
					444:[111,555],
					555:[222],
					666:[]};
var id=444;
var arr=getV(agentList,curLoc,desLoc,v,socialNetwork,id);
console.log(arr[0]);
console.log(arr[1]);
*/

/*
var IDList=getAgentIDList(100);
for(var i=0;i<100;i++)
	console.log(IDList[i]);
console.log("length"+IDList.length);
*/