let express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser');

let routeFunctions = require('./routeFunctions.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



//Routes-

//Welcome Route
app.get("/", (req, res) =>
    res.send("Welcome to Jobs Q"));

//Post new Job in the queue
app.post("/jobs/url", routeFunctions.createJobEntry)

//Get job status
app.get("/jobs/status/:jobID", routeFunctions.getJobStatus)

 

//Express App listens on Port 3000(local-host)
app.listen(3000,function() {
  console.log("Server has started");
});