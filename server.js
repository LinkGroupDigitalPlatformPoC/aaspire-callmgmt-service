
// Load config ...
require('dotenv').config()

 // First add the obligatory web framework
var express = require('express');
var app = express();
var cors = require('cors');
var compression = require('compression');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Some middleware
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Util is handy to have around, so thats why that's here.
const util = require('util')
// and so is assert
const assert = require('assert');

// We want to extract the port to publish our app on
var port = process.env.PORT || 8081;

// Then we'll pull in the database client library
var MongoClient = require("mongodb").MongoClient;

// Now lets get cfenv and ask it to parse the environment variable
var cfenv = require('cfenv');

debugger
var appenv = cfenv.getAppEnv();

// Within the application environment (appenv) there's a services object
var services = appenv.services;

// The services object is a map named by service so we extract the one for MongoDB
var mongodb_services = services["compose-for-mongodb"];

// This check ensures there is a services for MongoDB databases
assert(!util.isUndefined(mongodb_services), "Must be bound to compose-for-mongodb services");

// We now take the first bound MongoDB service and extract it's credentials object
var credentials = mongodb_services[0].credentials;

// Within the credentials, an entry ca_certificate_base64 contains the SSL pinning key
// We convert that from a string into a Buffer entry in an array which we use when
// connecting.
var ca = [new Buffer(credentials.ca_certificate_base64, 'base64')];

// This is a global variable we'll use for handing the MongoDB client around
var mongodb;

// This is the MongoDB connection. From the application environment, we got the
// credentials and the credentials contain a URI for the database. Here, we
// connect to that URI, and also pass a number of SSL settings to the
// call. Among those SSL settings is the SSL CA, into which we pass the array
// wrapped and now decoded ca_certificate_base64,
MongoClient.connect(credentials.uri, {
        mongos: {
            ssl: true,
            sslValidate: true,
            sslCA: ca,
            poolSize: 1,
            reconnectTries: 1
        }
    },
    function(err, db) {
        // Here we handle the async response. This is a simple example and
        // we're not going to inject the database connection into the
        // middleware, just save it in a global variable, as long as there
        // isn't an error.
        if (err) {
            console.log(err);
        } else {
            // Although we have a connection, it's to the "admin" database
            // of MongoDB deployment. In this example, we want the
            // "examples" database so what we do here is create that
            // connection using the current connection.
            mongodb = db.db("examples");
        }
    }
);

// Add words to the database
app.put("/calls", function(request, response) {
  mongodb.collection("calls").insertOne( {
    word: request.body.word, definition: request.body.definition}, function(error, result) {
      if (error) {
        response.status(500).send(error);
      } else {
        response.send(result);
      }
    });
});

// Then we create a route to handle our example database call
app.get("/calls", function(request, response) {
  // and we call on the connection to return us all the documents in the
  // words collection.
  mongodb.collection("calls").find().toArray(function(err, words) {
    if (err) {
     response.status(500).send(err);
    } else {
     response.send(words);
    }
  });
});

// Now we go and listen for a connection.
app.listen(port);

//??
require("cf-deployment-tracker-client").track();
