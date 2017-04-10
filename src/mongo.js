// Then we'll pull in the database client library
let MongoClient = require("mongodb").MongoClient;
const assert = require('assert');

function connect(cfenv, callback) {

    let appenv = cfenv.getAppEnv();

    // Within the application environment (appenv) there's a services object
    let services = appenv.services;

    // The services object is a map named by service so we extract the one for MongoDB
    let mongodb_services = services["compose-for-mongodb"];
    
    // This check ensures there is a services for MongoDB databases
    assert(!util.isUndefined(mongodb_services), "Must be bound to compose-for-mongodb services");

    // We now take the first bound MongoDB service and extract it's credentials object
    let credentials = mongodb_services[0].credentials;
    
    // Within the credentials, an entry ca_certificate_base64 contains the SSL pinning key
    // We convert that from a string into a Buffer entry in an array which we use when
    // connecting.
    let ca = [new Buffer(credentials.ca_certificate_base64, 'base64')];

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
                let mongodb = db.db("linkpoc");
                callback(mongodb);
            }
        }
    );
}

module.exports = connect;

