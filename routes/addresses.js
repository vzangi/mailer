const { Router } = require('express')
const router = Router()
const { withAuth } = require('../middlewares/auth')
const controller = require('../controllers/AddressesController')

router.use(withAuth)

router.get('/', controller.index.bind(controller))
router.post('/edit', controller.editField.bind(controller))
router.post('/remove', controller.removeItem.bind(controller))
router.post('/add', controller.addItem.bind(controller))
router.post('/find', controller.findItems.bind(controller))
router.post('/edit_groups', controller.editGroups.bind(controller))

router.get('/backup', controller.backup.bind(controller))
router.post('/restore', controller.restore.bind(controller))

module.exports = router
