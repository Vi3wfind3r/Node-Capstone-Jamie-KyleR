'use strict';
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {Security} = require('../schemas/securitySchema');
const {validateFields, addPortfolioDataToFile} = require('../helpers');

const router = express.Router();
router.use(morgan('common'));
router.use(bodyParser.json());

//REMOVE IN PRODUCTION
router.get('/', function(req, res) {
  Security
        .find()
        .then(function(allSecurities) {
          res.json(allSecurities);
        })
        .catch(function(err) {
          console.error(err);
        });
});

router.get('/:link', function(req, res) {
  Security
        .find({link: req.params.link})
        .then(function(item) {
          res.json(item);
        })
        .catch(function() {
          res.status(404).json({error: 'Not Found'});
        });
});

router.post('/', function(req, res) {
  const valid = validateFields(
    {
      'link': String(),
      'symbol': String(),
      'name': String(),
      'initialPrice': Number(),
      'numShares': Number()
    }, 
        req.body);
    
  if (valid.error) {
    console.error(valid.error);
    return res.status(400).json({response: valid.error});
  }
  console.log(req.body)
  Security
        .create({
          link: req.body.link,
          symbol: req.body.symbol,
          name: req.body.name,
          initialPrice: req.body.initialPrice,
          currentPrice: req.body.initialPrice,
          numShares: req.body.numShares
        })
        .then(function(item) {
          res.json(item);
        })
        .catch(function(err) {
          console.error(err);
          res.status(500).json({error: 'Something went wrong'});
        });
});

router.put('/', function(req, res) {
  Security
    .findOne({link: req.body.link, symbol: req.body.symbol})
    .then(security => {
      const updatedShares = security.numShares + req.body.numShares;
      Security.findOneAndUpdate(
        {link: req.body.link, symbol: req.body.symbol},
        {$set : {
          currentPrice: req.body.currentPrice,
          numShares: updatedShares
        }},
        {new : true}
      )
      .then(function(updatedSecurity) {
        console.log(updatedSecurity.link)
      });
    });
});

router.delete('/:link', function(req, res) {
  Security
    .findOneAndRemove({link: req.params.link, symbol: req.body.symbol})
    .exec()
    .then(() => {
      console.log(`Deleted security with id ${req.params.ID}`);
      res.status(204).end();
    });
});

module.exports = router;