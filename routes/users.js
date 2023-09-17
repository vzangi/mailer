const { Router } = require('express')
const router = Router()
const {withAuth, isSuper} = require('../middlewares/auth')
const controller = require('../controllers/UserController')

router.use(withAuth)
router.use(isSuper)

router.get('/', controller.index.bind(controller))
router.get('/all', controller.getAll.bind(controller))
router.post('/remove', controller.removeItem.bind(controller))
router.post('/edit', controller.editField.bind(controller))
router.post('/add', controller.addItem.bind(controller))

module.exports = router