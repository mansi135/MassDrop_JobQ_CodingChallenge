let JobEntry = require('./database.js');
let urlRequest = require('request-promise');
// let sleep = require('sleep');



exports.createJobEntry = function(req, res, next) {
   
    if (req.body.url === undefined) {
        err = "You must enter 'url' as key";
        err.stack = null;
        next(err);  // This will be handled by app.use(func(err..)) in server.js
    } else {
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
                    //console.log(err);
                    savedJob.error = 'Wrong URL or website down';
                    savedJob.error_details = err;
                    savedJob.status = 'Error';
                    savedJob.save();
                    // not sure if we need or should have following line here:
                    // next(err);
                }) 
        })

        .catch(function(err) {
            console.log("Oh no...something went wrong \n");
            console.log(err);
            // not sure if we need or should have following line here:
            // next(err);
        })
        // console.log("first thing to b printed");
    }
};



// get job status using JobID
exports.getJobStatus = function(req, res, next){
    JobEntry.findById(req.params.jobID)
     .then(function(returnedJob) {
        res.send(returnedJob);
     })
     .catch(function(err) {
        res.status(404).json({'error' : 'No such jobID found'});
     })
};

