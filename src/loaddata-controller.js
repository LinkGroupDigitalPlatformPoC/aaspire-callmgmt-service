const util = require('util')
const callsData = require('../data/samplecalldata.json')
const ObjectId = require('mongodb').ObjectId;

class LoadDataController {

    constructor(mongodb) {
        this.mongodb = mongodb;
    }

    // This is a test method which is responsible for loading test data
    loadTestData(request, response) {
    	
    	console.log("Contents read via requires..." + JSON.stringify(callsData));
    	
    	const callsArray = callsData.calls;
    
    	this.mongodb.collection("calls").insert(callsArray, function(error, result) {
		  if (error) {
                response.status(500).send(error);
            } else {
                response.send(result);
            }
        });

    }

    
}

module.exports = LoadDataController;
