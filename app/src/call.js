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
	        
    	this.memberId = body.memberId || null;
    	this.csrId  = body.csrId || null;
    	this.dateTimeInitiated = body.dateTimeInitiated || null;
    	this.dateTimeCompleted = body.dateTimeCompleted || null ;
    	this.notes = body.notes || null;
    	this.primaryTopic = body.primaryTopic || null;
    	this.secondaryTopic = body.secondaryTopic  || null;
    	this.status = body.status || null;	
	}
}

module.exports=Call;