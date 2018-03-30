
let request  = require("request"), //old method
    //assert = require('assert'), // This is Node's inbuilt assert library. I will try using chai's expect
    base_url = "http://localhost:3000/",
    expect   = require('chai').expect,
    app      = require('./../server.js');


// Integration tests - old method - using request (not using super-test)
describe("Welcome Route", function() {
  describe("GET /", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).to.eql(200);
        //assert.equal(200, response.statusCode);
        done();
      });
    });

    it("returns body", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).to.eql("Welcome to Jobs Q");
        //assert.equal("Welcome to Jobs Q", body);
        app.closeServer();
        done();
      });
    });
  });
});