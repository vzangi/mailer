const { Router } = require('express')
const router = Router()
const { withAuth, isAdmin } = require('../middlewares/auth')
const controller = require('../controllers/TransportsController')

router.use(withAuth)

router.get('/',isAdmin, controller.index.bind(controller))
router.get('/all', controller.getAll.bind(controller))
router.post('/remove', isAdmin, controller.removeItem.bind(controller))
router.post('/edit', isAdmin, controller.editField.bind(controller))
router.post('/add', isAdmin, controller.addItem.bind(controller))

module.exports = router