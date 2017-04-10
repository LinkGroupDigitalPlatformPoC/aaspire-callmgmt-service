
// Load config ...
// require('dotenv').config()

 // First add the obligatory web framework
let express = require('express');
let app = express();
let cors = require('cors');
let compression = require('compression');
let helmet = require('helmet');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

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
let port = process.env.PORT || 8081;

// Now lets get cfenv and ask it to parse the environment variable
let cfenv = require('cfenv');

// This is a global variable we'll use for handing the MongoDB client around
//let mongodb;

let connect =  cfenv.getAppEnv().isLocal ? require('./mongo-local') : require('./mongo');
connect(cfenv, (db) => { 
  
  let mongodb = db 

  let CallsController = require('./calls-controller');
  let controller = new CallsController(mongodb);

  // Then we create a route to handle our example database call
  app.get("/calls", controller.getAll.bind(controller));
  app.post("/calls", controller.createCall.bind(controller));

  // Now we go and listen for a connection.
  app.listen(port);

});

//??
require("cf-deployment-tracker-client").track();