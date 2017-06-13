'use strict';
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {Security} = require('./schemas/securitySchema');
const {generateRandomUrl, validateFields} = require('../helpers');

const router = express.Router();
router.use(morgan('common'));
router.use(bodyParser.json());
mongoose.Promise = global.Promise;