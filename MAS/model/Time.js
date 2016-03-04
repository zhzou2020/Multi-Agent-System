var hours = 8;
var minutes = 50;
var seconds = 0;

exports.increTime=function(){
    seconds++;
    //console.log(seconds+" s");
    if(seconds == 60){
        minutes++;
	    seconds = 0;
	    if(minutes == 60){
	        hours++;
		    minutes = 0;
		    if(hours == 24){
		        hours = 0; //此处不计天数
		    }
	    }
    }
}

exports.restore = function(){
    hours = 8;
    minutes = 50;
    seconds = 0;
}

exports.getHours=function(){
    return hours;
}

exports.getMinutes=function(){
    return minutes;
}

exports.getSeconds=function(){
    return seconds;
}

exports.getCurrentTime=function(){
    return hours+':'+minutes+':'+seconds;
}

exports.getMilliseconds = function(){
    return hours*60*60 + minutes*60 + seconds;
}