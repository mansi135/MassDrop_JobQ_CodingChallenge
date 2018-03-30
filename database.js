const mongoose = require('mongoose');
const db       = 'mongodb://localhost/job_queue';

// In Mongoose .then() or .exec() does not guarantee true Promise in queries, 
// hence I can use 'q' or 'bluebird'
// Learn difference between promise/ async-await / callbacks and exec()

mongoose.Promise = require('bluebird');

//Connect to db job_queue
mongoose.connect(db);  

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
    error: String,
    error_details: String
});

//Define Model and Export it
module.exports = mongoose.model("JobEntry", jobQueueSchema);
    

