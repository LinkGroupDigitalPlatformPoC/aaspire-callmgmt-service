const util = require('util')
const invariant = require('invariant');
const ObjectId = require('mongodb').ObjectId;

class CallsController {

    constructor(mongodb) {
        this.mongodb = mongodb;
    }

    getAll(request, response) {
        // and we call on the connection to return us all the documents in the calls collection.
        this.mongodb.collection("calls").find().toArray(function(err, calls) {
            if (err) {
                response.status(500).send(err);
            } else {
                response.send(calls);
            }
        });
    }

    //Here is the sample body of a well-defined call 
    /*
    {   
    	      "notes":{  
    	         "type":"string",
    	         "description":"Notes captured during engagement",
    	         "example":"Member expressed frustration at premium"
    	      },
    	      "status":{  
    	         "type":"string",
    	         "description":"Current status of the engagement (In Progress|Closing|Completed|Disconnected)",
    	         "example":"In Progress"
    	      },
    	      "dateTimeCompleted":{  
    	         "type":"string",
    	         "description":"Date and time the engagement was completed",
    	         "example":"2017-07-31 09:35"
    	      },
    	      "dateTimeInitiated":{  
    	         "type":"string",
    	         "description":"Date the calls as initiated",
    	         "example":"2017-07-31 09:30"
    	      },
    	      "engagementType":{  
    	         "type":"string",
    	         "description":"The type of engagement (Call Centre|In Person|Video Call|Chat)",
    	         "example":"Call Centre"
    	      },
    	      "memberId":{  
    	         "type":"string",
    	         "description":"Member identifier",
    	         "example":"23544334346"
    	      }
    	   }
   */
    
    createCall(request, response) {
        invariant(!util.isNullOrUndefined(request.body.memberId), "Must have memberId");
        invariant(!util.isNullOrUndefined(request.body.dateTimeInitiated), "Must have Date Time Initiated");
        invariant(!util.isNullOrUndefined(request.body.status), "Must have status");
        

        const newCall = { memberId: request.body.memberId, dateTimeInitiated: request.body.dateTimeInitiated ,  dateTimeCompleted: request.body.dateTimeCompleted , notes: request.body.notes , primaryTopic: request.body.primaryTopic, secondaryTopic: request.body.secondaryTopic };
        this.mongodb.collection("calls").insertOne(newCall, function(error, result) {
            if (error) {
                response.status(500).send(error);
            } else {
                response.send(result);
            }
        });
    }

    getById(request, response) {
        let oId = new ObjectId(request.params.id);
        this.mongodb.collection("calls").findOne({_id: oId}, function(err, call) {
            if (err) {
                response.status(500).send(err);
            } else if (call === null) {
                response.status(404).send(`No call with id ${request.params.id}`);
            } else {
                response.send(call);
            }
        });
    }

    getByMember(request, response) {
        this.mongodb.collection("calls").find({memberId: request.params.memberId}).toArray(function(err, calls) {
            if (err) {
                response.status(500).send(err);
            } else {
                response.send(calls);
            }
        });
    }
}

module.exports = CallsController;
