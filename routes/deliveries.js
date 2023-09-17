const { Router } = require('express')
const router = Router()
const { withAuth } = require('../middlewares/auth')
const controller = require('../controllers/DeliveryController')

router.use(withAuth)

router.get('/all', controller.getAll.bind(controller))
router.post('/remove', controller.removeItem.bind(controller))
router.post('/edit', controller.editField.bind(controller))
router.post('/add', controller.addItem.bind(controller))

router.get('/run/:id', controller.run.bind(controller))
router.get('/pause/:id', controller.pause.bind(controller))
router.get('/stop/:id', controller.stop.bind(controller))

router.get('/mailer', controller.mailer)

module.exports = router