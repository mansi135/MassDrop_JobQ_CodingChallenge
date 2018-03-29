

# A worker Job Queue 
Create a job queue whose workers fetch data from a URL and store the results in a database. The job queue should expose a REST API for adding jobs and checking their status / results.

Example:

User submits www.google.com to your endpoint. The user gets back a job id. Your system fetches www.google.com (the result of which would be HTML) and stores the result. The user asks for the status of the job id and if the job is complete, he gets a response that includes the HTML for www.google.com.

## Table of Contents
* [Setup](#setup)
* [Technologies Used](#technologiesused)
* [Testing](#testing)
* [Documentation and Usage](#docs)


## <a name="setup"></a>Setup

* requires npm install and mongodb installed prior to running this app
* run mongod in some terminal
* clone this directory in a different terminal
* cd into cloned directory
* run node server.js

## <a name="technologiesused"></a>Tech Stack

* Database : MongoDB, Mongoose ODM
* Server : Node.js, Express.js, bluebird Promises
* Testing : Mocha

## <a name="testing"></a>Testing Framework

## <a name="docs"></a>Usage

* I used POSTMAN to verify my GET and POST requests


![Alt text](./Pending.png) 

