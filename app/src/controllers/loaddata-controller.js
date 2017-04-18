const util = require('util');
const callsData = require('../../data/samplecalldata.json');
const BaseCallsController = require('./base-calls-controller');
const ObjectId = require('mongodb').ObjectId;

class LoadDataController  extends BaseCallsController {

    constructor(mongodb, nluAnalyse) {
        super(mongodb, nluAnalyse);
    }

    // This is a test method which is responsible for loading test data
    loadTestDataEndpoint(request, response) {
    	this.mongodb.collection("calls").insert(callsData.calls, (err, payload) => {
            this.loadCalls(err, payload, response, request.method, result => result.ops);
        });
    }

    loadTestData() {
        const consoleResponse = { send: result => { 
                console.log("============== Loading Sample Test Data: =============");
                console.log(JSON.stringify(result, null, 2));
                console.log("========== ========== ========== ========== ==========");
            }
        }

        this.mongodb.collection("calls").insert(callsData.calls, (err, payload) => {
            this.loadCalls(err, payload, consoleResponse, "POST", result => result.ops);
        });
    };
}

module.exports = LoadDataController;
