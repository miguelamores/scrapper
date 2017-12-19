var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
global.expect = chai.expect;

chai.use(chaiHttp);

it('should list ALL blobs on /scrape GET', function(done) {
  chai.request(server)
    .get('/scrape')
    .end(function(err, res){
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.lengthOf(30);
      res.body.forEach(function(element,i) {
        element.should.have.property('rank');
        element.should.have.property('title');
        element.should.have.property('score');
        element.should.have.property('comments');
      })
      done();
    });
});

it('should list filter on /scrape GET', function(done) {
  chai.request(server)
    .get('/scrape/more')
    .end(function(err, res){
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      done();
    });
});
