const util = require('util')
const assert = require('assert');

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

    createCall(request, response) {
        assert(!util.isUndefined(request.body.memberId), "Must have memberId");

        const newCall = { id: request.body.memberId };
        this.mongodb.collection("calls").insertOne(newCall, function(error, result) {
            if (error) {
                response.status(500).send(error);
            } else {
                response.send(result);
            }
        });
    }

}

module.exports = CallsController;