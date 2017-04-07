var chai = require('chai'),
request = require('request');
expect = chai.expect, // we are using the "expect" style of Chai

describe('To Check response of a server authenticate ', function() {
  	it('Reponse of authentication route ', function(done) {
  		this.timeout(0); // To prevent timeout error 
  		try{
	  		request.post('http://localhost:4000/authenticate',{ username: "username",password : '1234' }, function(error, response, body){
  				if(error){
  					done(e);
  				}
  				else{
	  				expect(JSON.parse(body).success).to.equal(false);
	  				done();
	  			}
			});
	  	}
	  	catch(e){
	  		done(e);
	  	}
  	});
});