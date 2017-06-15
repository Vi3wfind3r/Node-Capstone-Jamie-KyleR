'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const should = chai.should();

const{Portfolio} = require('../src/js/schemas/portfolioSchema');
const {generateRandomUrl} = require('../src/js/helpers');
const {generateSecuritiesData} = require('./test-security');
const {app, runServer, closeServer} = require('../server');
const router = require('../src/js/routes/portfolioRouter');

const {TEST_DATABASE_URL} = require('../config/config');
const dirname = __dirname.split('/').slice(0, -3).join('/');

chai.use(chaiHttp);
chai.use(require('chai-moment'));

function seedPortfolioData() {
  console.info('seeding portfolio data');
  const seedData = [];

  for (let i = 1; i <= 1; i++) {
    seedData.push(generatePortfolioData());
  }
  // this will return a promise
  return Portfolio.insertMany(seedData);
}

function generatePortfolioData() {
  return {
    link: generateRandomUrl(),
    name: faker.name.firstName() + ' ' + faker.name.lastName(),
    value: faker.random.number({min: 100000, max: 10000000})
  };
}



function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Portfolio API resource', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return seedPortfolioData();
  });

  // afterEach(function () {
  //   return tearDownDb();
  // });

  after(function () {
    return closeServer();
  });


  describe('GET endpoint', function () {
    it('should return portfolios with right fields', function () {
      // Strategy: Get back portfolio, and ensure it has expected keys
      return Portfolio
        .find()
        .exec()
        .then(res => {
          let url = res[0].link;
          return chai.request(app)
          .get(`/portfolio/${url}`);
        })
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.a('object');
        });
    });
  });

  describe.only('POST endpoint', function () {

    it('should add a new security to portfolio', function () {
      return Portfolio
        .find()
        .exec()
        .then(res => {
          let url = res[0].link;
          const newSecurity = generateSecuritiesData(url);
          return chai.request(app)
          .post('/security')
          .send(newSecurity);
        })
        .then(function (res) {
          res.should.have.status(200);
          console.log('should be portfolio object', res);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'id', 'link', 'symbol', 'name', 'initialPrice', 'currentPrice', 'numShare');
          res.body.id.should.not.be.null;
          res.body.name.should.equal(${newSecurity.name});
          res.body.value.should.equal(newSecurity.value);
          createdAt = res.body.created;
          return Security.findById(res.body.id);
        // })
        // .then(function (portfolio) {
        //   portfolio.title.should.equal(newPortfolio.title);
        //   portfolio.content.should.equal(newPortfolio.content);
        //   portfolio.author.firstName.should.equal(newPortfolio.author.firstName);
        //   portfolio.created.should.be.sameMoment(createdAt);
        });
    });
  });


}); //closing describe 
