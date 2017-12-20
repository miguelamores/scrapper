var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var assert = chai.assert;
global.expect = chai.expect;

chai.use(chaiHttp);

it('should list ALL Hacker news on /scrape GET', function(done) {
this.timeout(6000);
  chai.request(server)
    .get('/scrape')
    .end(function(err, res){
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.lengthOf(30);
        res.body[0].should.have.property('rank');
        res.body[0].should.have.property('title');
        res.body[0].should.have.property('score');
        res.body[0].should.have.property('comments');
      done();
    });
});

it('should list hacker news with more than 5 words in title on /scrape/more GET', function(done) {
  chai.request(server)
    .get('/scrape/more')
    .end(function(err, res){
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      assert.equal(res.body[0].title.split(" ").length >5, true);
      done();
    });
});

it('should list hacker news with less or equal than 5 words in title on /scrape/less GET', function(done) {
  chai.request(server)
    .get('/scrape/less')
    .end(function(err, res){
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      res.body.forEach(function(element,i) {
        element.should.have.property('rank');
        element.should.have.property('title');
        element.should.have.property('score');
        element.should.have.property('comments');
        assert.equal(element.title.split(" ").length <= 5, true);
      });

      done();
    });
});
