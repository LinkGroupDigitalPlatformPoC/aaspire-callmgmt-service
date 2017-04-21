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
    	
    	//Let's clear the data before we insert the test data sample
    	var that = this;
    	this.mongodb.collection("calls").remove({},function(err,numberRemoved){
    		
    		if (!err){
    			console.log("The number of documented removed is:" + numberRemoved);
    			
    			that.mongodb.collection("calls").insert(callsData.calls, (err, payload) => {
    	            that.loadCalls(err, payload, response, request.method, result => result.ops);
    	        });
    			
    		}
             
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
