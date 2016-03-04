exports.observe=function(actor,actorList){
    var agents = actorList.toArray();
    var agentsObserved = {};
    agentsObserved[actor.getID()] = [actor.getX(),actor.getY()];
    for(var i in agents){
        var agent = agents[i];
        var x_offset = agent.getX() - actor.getX();
        var y_offset = agent.getY() - actor.getY();
        var d=Math.sqrt(Math.pow(x_offset,2)+Math.pow(y_offset,2));

        if(d<=50){//视界范围 d
            agentsObserved[agent.getID()] = [agent.getX(),agent.getY()];
        }

        
    }

    return agentsObserved;
}