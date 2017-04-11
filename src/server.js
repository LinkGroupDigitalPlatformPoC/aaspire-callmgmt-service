
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

// Util is handy to have around, so thats why that's here.
const util = require('util')

// Some middleware
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// We want to extract the port to publish our app on
let port = process.env.PORT || 8081;

// Now lets get cfenv and ask it to parse the environment variable
let cfenv = require('cfenv');
let connect =  cfenv.getAppEnv().isLocal ? require('./mongo-local') : require('./mongo');

connect(cfenv, (db) => { 
  let CallsController = require('./calls-controller');
  let controller = new CallsController(db);

  // Then we create a route to handle our example database call
  app.get("/calls", controller.getAll.bind(controller));
  app.post("/calls", controller.createCall.bind(controller));
  app.get("/calls/:id", controller.getById.bind(controller));
  app.get("/members/:memberId/calls", controller.getByMember.bind(controller));
  
  
  //These are used for testing purposes only. An easy way to load the test data
  let LoadDataController = require('./loaddata-controller');
  let loadDataController = new LoadDataController(db);
  app.post("/loaddata", loadDataController.loadTestData.bind(loadDataController));

  // Now we go and listen for a connection.
  app.listen(port);
});

//??
require("cf-deployment-tracker-client").track();
