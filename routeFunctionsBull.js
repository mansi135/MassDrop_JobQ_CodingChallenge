const JobEntry = require('./database.js');
const urlRequest = require('request-promise');

const Queue = require('bull');
const jobQueue = new Queue('Fetching-URLS-Q');

//we are using mongo db to save user entries, 
//but bull internally is using redis to enqueue and process jobs
//so make sure to run redis server
//This queue uses its workers to do the job asynchronously 

jobQueue.process(function(job, done) {
    let jobid = job.data.id;
    let url = job.data.url;
    
    console.log('Job in Progress...');
    job.progress(42);

    getHTMLContents(url, jobid);
    
    done(console.log('Job completed'));

    done(new Error('cannot do this job'));
});


function getHTMLContents(url, jobid) {
    urlRequest(url)
        .then(function(responseHtml) {
            JobEntry.findOne({_id: jobid}, function(error, job) {
                if(error) {
                    console.log(error);
                } else {
                    job.responseHtml = responseHtml;
                    job.status = 'Done';
                    job.save();
                }
            })  
        })
        .catch(function(err) {
            JobEntry.findOne({_id: jobid}, function(error, job) {
                if(error) {
                    console.log(error);
                } else {
                    job.error = 'Wrong URL or website down';
                    job.error_details = err;
                    job.status = 'Error';
                    job.save();
                }
            })
        }) 
    
}


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

        //Step2- give a response back immediately to user and add it to 'bull' instance
        .then(function(savedJob) {  
              res.send(savedJob);  //end req-res cycle here
              // new addition - this utilizes bull queue to do the work asynchronously 
              jobQueue.add({url: savedJob.url, id: savedJob._id}).then(function (data) {
                    console.log('Job with id ' + data.id + ' added to queue');
                  }, function (error) {
                    console.error('Could not add job due to:' + error);
                  });
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
        console.log(err);
        res.status(404).json({'error' : 'No such jobID found'});
     })
};

