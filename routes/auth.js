const { Router } = require('express')
const router = Router()
const controller = require('../controllers/AuthController')
const { withAuth } = require('../middlewares/auth')

// Вход 
router.get('/login', controller.login)

// Авторизация
router.post('/login', controller.tryLogin)

// Выход
router.get('/logout', withAuth, controller.logout)


module.exports = router