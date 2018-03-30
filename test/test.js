
let supertest  = require('supertest'),
    expect     = require('chai').expect, 
    should     = require('should');

let base_url = "http://localhost:3000",
    app      = require('./../server.js');
    mongoose = require('mongoose');

let server = supertest.agent(base_url);


// Unit tests - testing a static route
describe("Welcome Route GET /", function() {
  
  it("returns status code 200 and Welcome message", function(done) {
    server
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        // Here is where we handle the response
        // HTTP status should be 200
        res.status.should.equal(200);
        // Welcome Message
        res.body.msg.should.equal('Welcome to Jobs Q');
        done();
       })
   });

});


//Integration tests - tesing post request to database

describe("Post a new job POST/", function() {

  mongoose.connect('mongodb://localhost/tstDB');

  it('should write to DB and give a response back that has jobID', function(done) {
    let payload = { url: 'https://www.massdrop.com/#login' };
    server
      .post('/jobs/url')
      .send(payload)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body.status.should.equal('Pending');
        res.body.should.have.any.keys('_id', 'status', 'url');
        res.body.should.not.have.key('responseHtml');

        done();
      });
  });

})



describe("Get a job status GET/", function() {

  mongoose.connect('mongodb://localhost/tstDB');

  it('should get error when random jobID is given', function(done) {
    server
      .get('/jobs/status/1234')
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body.error.should.equal('No such jobID found');
        done();
      });
  });

  it('should get responseHtml as a key', function(done) {
    server
      .get('/jobs/status/5abdda4969a6d3be20440e43')
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body.responseHtml.should.containEql('<!DOCTYPE html><html><head data-prefix');
        done();
      });
  });

})


