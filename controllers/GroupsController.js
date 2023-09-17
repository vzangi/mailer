const DeliveryGroup = require('../models/DeliveryGroup')
const BaseController = require('./BaseController')

class GroupsController extends BaseController { }

module.exports = new GroupsController(DeliveryGroup, 'groups')
