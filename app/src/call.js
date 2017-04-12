/**
 * 
 */

const util = require('util');
const invariant = require('invariant');

class Call {

	constructor(body) {
		invariant(!util.isNullOrUndefined(body.memberId), "Must have memberId");
		invariant(!util.isNullOrUndefined(body.csrId), "Must have csrId");
		invariant(!util.isNullOrUndefined(body.dateTimeInitiated), "Must have Date Time Initiated");
		invariant(!util.isNullOrUndefined(body.status), "Must have status");
	        
    	this.memberId = body.memberId;
    	this.csrId  = body.csrId;
    	this.dateTimeInitiated = body.dateTimeInitiated;
    	this.dateTimeCompleted = body.dateTimeCompleted ;
    	this.notes = body.notes;
    	this.primaryTopic = body.primaryTopic;
    	this.secondaryTopic = body.secondaryTopic ;
    	this.status = body.status ;
		
	}
}

module.exports=Call;