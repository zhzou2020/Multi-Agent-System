//scene 的结构，以cue为key，映射一个对象列表，列表中的对象包含action和对应的目的agnet id。
function Scene(s_id){
	if(!s_id)
		throw 'error in Scene';
	this.id = s_id;
	this.cue_actions = {};//{cue:{action_descript:[id1,id2...]}}
}

Scene.prototype.getID = function(){
	return this.id;
}

Scene.prototype.add = function(cue,obj_id,action_descript){
	if(!this.cue_actions[cue]){
		var newMap = {};
		newMap[action_descript] = [obj_id];
		this.cue_actions[cue] = newMap;
		return;
	}
	var action_map = this.cue_actions[cue];
	if(!action_map[action_descript]){
		action_map[action_descript] = [obj_id];
		return;
	}

	action_map[action_descript].push(obj_id);
}
//@return {action_descript:[ids]}
Scene.prototype.get = function(cue){
	if(this.cue_actions[cue]){
		return this.cue_actions[cue];
	}
	return null;
}

module.exports = Scene;