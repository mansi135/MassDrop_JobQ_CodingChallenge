let express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser');
    mongoose    = require("mongoose");

let JobEntry = require('./database.js');

var rp = require('request-promise');

//Connect to db
mongoose.connect("mongodb://localhost/job_queue");  


app.use(bodyParser.urlencoded({extended: true}));

converts post data to json
app.use(bodyParser.json());

//There is something called as Middleware (to use express.Router() and app.params)

createJobEntry = function(req, res, next) {
   
   // Step1- save the new post request
   // This statement will return the db entry just created, so we can pass it to .then
    JobEntry.create({   timeCreated: new Date(),
        url: req.body['url'],
    })

    //Step2- give a response back immediately 
    .then(function(savedJob) {  // I am passing this jobentry that I just saved, so that I dont have to query it back
        res.send(savedJob);
        return savedJob;    // This return will pass it to .then(next future)
    }, function(err) {
        next(err);
    })

    //Step3- fetch the url and save the html in database
    .then(function(savedJob){
      rp(savedJob.url)    // this will return html, which i capture in .then future
        .then(function(responseHtml) {
            //console.log(responseHtml);
            savedJob.responseHtml = responseHtml;
            savedJob.status = 'Done';
            savedJob.save();
        }, function(err) {
            console.log("Wrong URL or website down");
            // we cant use res anymore since it has already been used by above .then
            // res.send("Oh, no ! something went wrong")
            //cannot do res.send(req) since its a circular onject, hence jsonify will fail
        })
    }, function(err) {
        console.log("Database/ Server error");
        // res.send("Internal error, try again");
    })
};


getJobStatus = function(req, res, next){
    JobEntry.findById(req.params.jobID)
     .then(function(returnedJob) {
        res.send(returnedJob);
     }, function(err) {
        res.send("No job found");
     })
}

app.post("/jobs/url", createJobEntry)

app.get("/jobs/status/:jobID", getJobStatus)

 

//Express App listens on Port 3000(local-host)
app.listen(3000,function() {
  console.log("Server has started");
});