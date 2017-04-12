const invariant = require('invariant');
const ObjectId = require('mongodb').ObjectId;
const Call = require('./call');
const common = require('./common');

class CallsController {

    constructor(mongodb) {
        this.mongodb = mongodb;
    }

    getAll(request, response) {
        // and we call on the connection to return us all the documents in the
		// calls collection.
        this.mongodb.collection("calls").find().toArray(function(err, calls) {
            if (err) {
                response.status(500).send(err);
            } else {
                response.send(calls.map(common.filterEmptyProps));
            }
        });
    }
    
    createCall(request, response) {
      
        const newCall = new Call(request.body); 
        this.mongodb.collection("calls").insertOne(newCall, function(error, result) {
            if (error) {
                response.status(500).send(error);
            } else {
            	
            	var callInfo = common.filterEmptyProps(result.ops[0]);
                response.send(callInfo);
            }
        });
    }
    
    updateCall(request, response) {
        const updatedCall = new Call(request.body); 
        var oId = new ObjectId(request.params.id);
        
        console.log("ID to change is:" + oId);
        
        //this.mongodb.collection("calls").findAndModify( { _id: oId} , [[ '_id', 'asc']], { $set: updatedCall } , { },  function(error, result) {
        //this.mongodb.collection("calls").updateOne( { _id: oId} , updatedCall, function(error, result) { //does not work - comes up as unimplemented
        
        var that = this; //this and that are giving us some laugh...
        
        this.mongodb.collection("calls").update( { _id: oId} , { $set: new Call(request.body) }, function(error, result) { //Works 
            if (error) {
                response.status(500).send(error);
            } else {
            	that.getById(request,response);
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
                response.send(common.filterEmptyProps(call));
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
