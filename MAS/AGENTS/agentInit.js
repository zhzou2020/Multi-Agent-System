/*!
 * Agent initialization
 * Author:zhpp
 * time:2014-12-01
 * 起床时间和睡觉时间符合正太分布，为了符合实际情况，起床时间是以7:00为对称符合正太分布，小于6:00
 * 和大于8:00认为是不合理的，被舍弃。睡觉时间是以21:30为对称符合正太分布，小于19:00和大于24:00认为是不合理的，被舍弃。
 */


/**
 * 获取agent的坐标
 * @param x
 * @param y
 * @param radius
 * @returns {Array}
 */
function getPosition(x,y,radius){
	while(true){
		xPos = Math.random()*(2*radius)+x-radius;
		yPos =   Math.random()*(2*radius)+y-radius;
		distance = (xPos-x)*(xPos-x)+(yPos-y)*(yPos-y);
		distance = Math.sqrt(distance);
		if(distance<=radius){
			return [xPos,yPos];
		}
	}
}

/*var position = getPosition(0,0,2);
console.log("output"+position[0]+position[1]);*/

/**
 * 获取符合标准正太分布的数
 * @param mean
 * @param std_dev
 * @returns
 */
function getNumberInNormalDistribution(mean,std_dev){
    return mean+(randomNormalDistribution()*std_dev);
}

function randomNormalDistribution(){
    var u=0.0, v=0.0, w=0.0, c=0.0;
    do{
        //获得两个（-1,1）的独立随机变量
        u=Math.random()*2-1.0;
        v=Math.random()*2-1.0;
        w=u*u+v*v;
    }while(w==0.0||w>=1.0)
    //这里就是 Box-Muller转换
    c=Math.sqrt((-2*Math.log(w))/w);
    //返回2个标准正态分布的随机数，封装进一个数组返回
    //当然，因为这个函数运行较快，也可以扔掉一个
    //return [u*c,v*c];
    return u*c;
}

/**
 * 获取符合标准正太分布的起床时间，默认在7点时刻起床的概率最大
 */
function getWakeUpTime(){
	wakeUpNumber = getNumberInNormalDistribution(25200,3600);
	wakeUpNumber = Math.round(wakeUpNumber);
	while(wakeUpNumber < 21600 || wakeUpNumber > 28800){
		wakeUpNumber = getNumberInNormalDistribution(25200,3600);
		wakeUpNumber = Math.round(wakeUpNumber);
	}
	return wakeUpNumber;
}


/**
 * 获取符合标准正太分布的睡觉时间，默认在21:30刻睡觉的概率最大
 * @returns
 */
function getSleepTime(){
	sleepNumber =  getNumberInNormalDistribution(77400,9000);
	sleepNumber = Math.round(sleepNumber);
	while(sleepNumber > 86400 || sleepNumber < 68400){
		sleepNumber =  getNumberInNormalDistribution(77400,9000);
		sleepNumber = Math.round(sleepNumber);
	}	
	return sleepNumber;
	
}

/**
 * 对外接口，获取agent初始化的参数
 * @param homeX home中心位置x坐标
 * @param homeY home中心位置y坐标
 * @param homeRadius home的半径
 * @param officeX office的中心的x坐标
 * @param officeY office的y坐标
 * @param officeRadius office的半径
 * @param num agent的数量
 * @returns home的x,y坐标，office的x,y坐标，起床时间，睡觉时间
 */
exports.getInitAgents = function(homeX,homeY,homeRadius,officeX,officeY,
		officeRadius,num){
	var agents = new Array() ;
	for(i = 0;i < num;i++){
		homePos = getPosition(homeX,homeY,homeRadius);
		officePos = getPosition(officeX,officeY,officeRadius);
		agents[i] = [homePos[0],homePos[1],officePos[0],officePos[1],
		             getWakeUpTime(),getSleepTime()];
	}
	return agents;
}