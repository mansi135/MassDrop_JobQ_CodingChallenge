let mongoose = require("mongoose");

//Connect to the database
// mongoose.connect("mongodb://localhost/job_queue");  

// Define Schema
var jobQueueSchema = new mongoose.Schema({
    timeCreated: Date,
    url: String,
    status: {
        type: String,
        enum: ['Pending', 'Done', 'Error'],
        default: 'Pending'
    },
    responseHtml: String,
});

//Define Model
// var JobEntry = mongoose.model("JobEntry", jobQueueSchema);

module.exports = mongoose.model("JobEntry", jobQueueSchema);
    // JobEntry.create({
    //     timeCreated: new Date(),
    //     websiteToVisit: "www.google.com",
    //     status: "Pending",
    //     result: ""
    // }, function(err, job) {
    //     if(err){
    //         console.log(err);
    //     } else {
    //         console.log("ID" , job._id);
    //     }
    // })


// JobEntry.findOneAndUpdate({status: 'Done'}, {status: 'Error'}, function(err, res) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(res);
//     }
// });

