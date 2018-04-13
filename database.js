const mongoose = require('mongoose');
const db       = 'mongodb://localhost/job_queue';

// job_queue is the name of database
// JobEntry is one schema or one table
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
    

