const ObjectId = require('mongodb').ObjectId;
const Call = require('../model/call');
const BaseCallsController = require('./base-calls-controller')
const common = require('../common');

class CallsController extends BaseCallsController {

    constructor(mongodb, nluAnalyse) {
        super(mongodb, nluAnalyse);
    }

    getAll(request, response) {
        this.mongodb.collection("calls").find().toArray((err, payload) => {
            this.loadCalls(err, payload, response, request.method)
        });
    }
    
    createCall(request, response) {      
        const newCall = new Call(request.body); 
        this.mongodb.collection("calls").insertOne(newCall, (err, payload) => {
            this.loadCalls(err, payload, response, request.method, payload => payload.ops[0])
        });
    }
    
    updateCall(request, response) {
        const updatedCall = new Call(request.body); 
        var oId = new ObjectId(request.params.id);
        var that = this; //this and that are giving us some laugh...
        
        this.mongodb.collection("calls").update( { _id: oId} , { $set: new Call(request.body) }, function(error, result) { //Works 
            if (error) {
                response.status(500).send(error);
            } else {
            	that.getById(request, response);
            }
        });
    }

    getById(request, response) {
        let oId = new ObjectId(request.params.id);
        this.mongodb.collection("calls").findOne({_id: oId}, (err, payload) => {
            this.loadCalls(err, payload, response, request.method)
        });
    }

    getByMember(request, response) {
        this.mongodb.collection("calls").find({memberId: request.params.memberId}).toArray((err, payload) => {
            this.loadCalls(err, payload, response, request.method)
        });
    }
}

module.exports = CallsController;
