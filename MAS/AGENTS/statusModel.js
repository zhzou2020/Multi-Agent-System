function Status()
{
    this.status={};
};

Status.prototype.setStatus = function(status_field,status_value){
	this.status[status_field] = status_value;
}

Status.prototype.getStatus = function(status_field){
	if(this.status[status_field]){
		return this.status[status_field];
	}
	return null;
}

module.exports=Status;