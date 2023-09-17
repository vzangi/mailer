const { Router } = require('express')
const router = Router()
const { withAuth } = require('../middlewares/auth')
const controller = require('../controllers/GroupsController')

router.use(withAuth)

router.get('/', controller.index.bind(controller))
router.get('/all', controller.getAll.bind(controller))
router.post('/remove', controller.removeItem.bind(controller))
router.post('/edit', controller.editField.bind(controller))
router.post('/add', controller.addItem.bind(controller))

module.exports = router