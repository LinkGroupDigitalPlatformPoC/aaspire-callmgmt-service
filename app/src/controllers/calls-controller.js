const ObjectId = require('mongodb').ObjectId;
const Call = require('../model/call');
const BaseCallsController = require('./base-calls-controller')
const common = require('../common');
const _ = require('lodash');

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

    getMemberAnalysis(request, response) {
        var that = this;
        this.mongodb.collection("calls").find({memberId: request.params.memberId}).toArray((err, payload) => {
            if(err) {
                response.status(500).send(err);
            } else {
                const promiseToEnrichAll = Promise.all(payload.map(call => that.enrichCall(call, request.method)));
                this.writeAnalysisResponse(response, promiseToEnrichAll);
            }
        });
    }

    writeAnalysisResponse(response, promiseToEnrichAll) {
        promiseToEnrichAll.then(calls => {
            const analyses = _.compact(calls.map(c => c.analysis));
            response.send(this.averageAnalyses(analyses));
        }).catch(e => response.status(500).send(err));
    }

    averageAnalyses(analyses) {
        if(analyses.length === 0) {
            return { };
        } else {
            return {
                    sentiment: {
                        score: common.average(analyses.map(a => a.sentiment.score))
                    },
                    emotion: {
                        sadness: common.average(analyses.map(a => a.emotion.sadness)),
                        joy: common.average(analyses.map(a => a.emotion.joy)),
                        fear: common.average(analyses.map(a => a.emotion.fear)),
                        disgust: common.average(analyses.map(a => a.emotion.disgust)),
                        anger: common.average(analyses.map(a => a.emotion.anger))
                    }
                }
        }
    }
}

module.exports = CallsController;
