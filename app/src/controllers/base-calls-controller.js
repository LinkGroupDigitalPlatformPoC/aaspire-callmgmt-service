const ObjectId = require('mongodb').ObjectId;
const Call = require('../model/call');
const common = require('../common');
const util = require('util')

class BaseCallsController {

    constructor(mongodb, nluAnalyse) {
        this.mongodb = mongodb;
        this.nluAnalyse = nluAnalyse;
    }

    loadCalls(err, payload, response, method, extractCallsData=(payload => payload)) {
        const that = this;
        const callData = extractCallsData(payload);
        
        if (err) {
            response.status(500).send(err);
        } else if (util.isArray(callData)) {
            const promiseToEnrichAll = Promise.all(callData.map(call => that.enrichCall(call, method)));
            this.writeResponse(response, promiseToEnrichAll, callData)
        } else {
            const promiseToEnrich = this.enrichCall(callData, method);
            this.writeResponse(response, promiseToEnrich, callData)
        }
    }

    writeResponse(response, resultPromise, originalPayload) {
        resultPromise.then((payload) => {
            if (util.isArray(payload)) {
                response.send(payload.map(common.filterEmptyProps));
            } else {
                response.send(common.filterEmptyProps(payload));
            }
        }).catch((e) => {
            console.log(e);
            response.send(common.filterEmptyProps(originalPayload));
        });
    }

    enrichCall(call, method) {
        const that = this;
        
        const text = this.analysisText(call);
        const missesAnalysis = text !== '' && util.isNullOrUndefined(call.analysis);
        const potentialUpdate = !util.isNullOrUndefined(call.analysis) && call.analysis.text !== text;

        if (missesAnalysis || potentialUpdate) {
            return this
                .analyseCall(call, text)
                .then(this.updateCallWithAnalysis.bind(that))
                .then(this.promiseCallById.bind(that));
        } else {
            return new Promise((resolve, reject) => {
                resolve(call)
            });
        }
    }

    analysisText(call) {
        const transcript = call.analysis? call.analysis.text : '';
        const clientTranscript = (call.transcript || "").split(/\n/).filter(l => l.startsWith("Client:")).join("\n");
        const notes = call.notes || '';
        return (notes + "\n" + clientTranscript).trim();
    }

    analyseCall(call, text) {
        return this.nluAnalyse(text)
            .then(a => new Promise((resolve, reject) => {
                call.analysis = {
                    sentiment: a.sentiment.document,
                    emotion: a.emotion.document.emotion,
                    text: text 
                };
                resolve(call);
            }));
    }

    updateCallWithAnalysis(call) {
        return new Promise((resolve, reject) => {
            const oId = call._id;

            this.mongodb.collection("calls").update({ _id: oId }, { $set: { analysis: call.analysis }}, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(oId);
                    }
                });
        })
    }

    promiseCallById(oId) {
        return new Promise((resolve, reject) => {
            this.mongodb.collection("calls").findOne({ _id: oId }, (err, call) => {
                    if (err) {
                        reject(err);
                    } else if (call === null) {
                        reject(`No call with id ${request.params.id}`);
                    } else {
                        resolve(common.filterEmptyProps(call));
                    }
                });
        })
    }
}

module.exports = BaseCallsController;
