// Then we'll pull in the database client library
let mongodb = require('mongo-mock');

function connect(cfenv, dbWorkers, callback) {
    // Connection URL
    let url = 'mongodb://localhost:27017/myproject';
    
    // Use connect method to connect to the Server
    mongodb.MongoClient.connect(url, {}, function(err, db) {
        // Get the documents collection
        // let collection = db.collection('calls');
        callback(db);
    })
};

module.exports = connect;

