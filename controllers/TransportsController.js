const Transport = require('../models/Transport')
const BaseController = require('./BaseController')

class TransportsController extends BaseController {}

module.exports = new TransportsController(Transport, 'transports')
