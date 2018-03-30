let express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser');

let routeFunctions = require('./routeFunctions.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



//Welcome Route
app.get("/", (req, res) =>
    res.status(200).json({"msg" : "Welcome to Jobs Q"}));

//Post new Job in the queue
app.post("/jobs/url", routeFunctions.createJobEntry);

//Get job status
app.get("/jobs/status/:jobID", routeFunctions.getJobStatus);


// A general purpose error handler that will be called last in the error stack using next()
// from express.js tutorials
app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status(500).send(err);
});

//Express App listens on Port 3000(local-host)
app.listen(3000,function() {
  console.log("Server has started");
});

//for testing in mocha
module.exports = app;