let JobEntry = require('./database.js');
let urlRequest = require('request-promise');


// Assigning things to future using 'then' is similar to spawning threads?
exports.createJobEntry = function(req, res, next) {
   
   // Step1- save the new post request
   // Return the db entry just created to future .then
    JobEntry.create({ timeCreated: new Date(),
        url: req.body.url,
    })

    //Step2- give a response back immediately to user
    .then(function(savedJob) {  
          res.send(savedJob);  //end req-res cycle here
          return savedJob;    // Return saveJob to future .then, no need to query same thing from db 
    })

    //Step3- fetch the url and save the html in database
    .then(function(savedJob){
          urlRequest(savedJob.url)    // Return html to future .then 
            .then(function(responseHtml) {
                savedJob.responseHtml = responseHtml;
                savedJob.status = 'Done';
                savedJob.save();
            })
            .catch(function(err) {
                console.log("Wrong URL or website down \n");
                console.log(err);
                savedJob.status = 'Error';
                savedJob.save();
            })
    })

    .catch(function(err) {
        console.log("Oh no...something went wrong \n");
        console.log(err);
    })
};



// get job status using JobID
exports.getJobStatus = function(req, res, next){
    JobEntry.findById(req.params.jobID)
     .then(function(returnedJob) {
        res.send(returnedJob);
     })
     .catch(function(err) {
        res.status(404).send("No job found");
     })
};

