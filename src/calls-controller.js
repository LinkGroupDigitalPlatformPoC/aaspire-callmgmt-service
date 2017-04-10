const util = require('util')
const assert = require('assert');
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

    createCall(request, response) {
        //assert(!util.isUndefined(request.body.memberId), "Must have memberId");

        const newCall = { memberId: request.body.memberId };
        this.mongodb.collection("calls").insertOne(newCall, function(error, result) {
            if (error) {
                response.status(500).send(error);
            } else {
                response.send(result);
            }
        });
    }

    getById(request, response) {
        // and we call on the connection to return us all the documents in the calls collection.
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
        // and we call on the connection to return us all the documents in the calls collection.
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
