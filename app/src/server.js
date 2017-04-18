
// Load config ...
require('dotenv').config()

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

// Load the controllers ...
const CallsController = require('./controllers/calls-controller');
const LoadDataController = require('./controllers/loaddata-controller');

// Some middleware
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// We want to extract the port to publish our app on
const port = process.env.PORT || 8081;
const dbWorkers = 10;

// Now lets get cfenv and ask it to parse the environment variable
const cfenv = require('cfenv');
const connect =  cfenv.getAppEnv().isLocal ? require('./services/mongo-local') : require('./services/mongo');
const nluAnalyse = cfenv.getAppEnv().isLocal ? require('./services/watson-nlu-local') : require('./services/watson-nlu');
const transcribe = cfenv.getAppEnv().isLocal ? require('./services/watson-speech-to-text-local') : require('./services/watson-speech-to-text');

connect(cfenv, dbWorkers, (db) => {
  // Start a transcripting job in the background - every 15 mins
  const TranscribingJob = require('./jobs/transcripting-job');
  const job = new TranscribingJob(db, transcribe, dbWorkers / 2);
  var period = 15 * 60 * 1000;
  setInterval(job.run.bind(job), period);

  const controller = new CallsController(db, nluAnalyse);

  // Then we create a route to handle our example database call
  app.get("/calls", controller.getAll.bind(controller));
  app.post("/calls", controller.createCall.bind(controller));
  app.put("/calls/:id", controller.updateCall.bind(controller));
  app.get("/calls/:id", controller.getById.bind(controller));
  app.get("/members/:memberId/analysis", controller.getMemberAnalysis.bind(controller));
  app.get("/members/:memberId/calls", controller.getByMember.bind(controller));
  
  //These are used for testing purposes only. An easy way to load the test data
  const loadDataController = new LoadDataController(db, nluAnalyse);
  app.post("/loaddata", loadDataController.loadTestDataEndpoint.bind(loadDataController));

  // Load some data for local environment
  if(cfenv.getAppEnv().isLocal) {
    loadDataController.loadTestData();
  }

  // Now we go and listen for a connection.
  app.listen(port);
});

//??
require("cf-deployment-tracker-client").track();
