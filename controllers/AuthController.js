const bcrypt = require('bcrypt')
const User = require('../models/User')
const { createToken, tokenCookieName } = require('../utils/jwt')
const maxAge = 1000 * 60 * 60 * 24 * 365

class AuthController {
    login(req, res) {
        res.render('pages/login')
    }

    async tryLogin(req, res) {
        const { login, password } = req.body

        const user = await User.findOne({
            where: {
                login
            }
        })

        if (!user) {
            return res.status(400).json([{ msg: "Пользователь с таким логином не найден" }])
        }

        bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                return res.status(400).json([{ msg: "Неверное сочетание логина и пароля" }])
            }

            const accessToken = createToken(user)

            res.cookie(tokenCookieName, accessToken, {
                maxAge,
            })

            return res.json({ msg: "Вход выполнен успешно" })
        }).catch(err => {
            console.log(err);
            return res.status(400).json({ msg: "Ошибка при авторизации" })
        })
    }

    logout(req, res) {
        res.clearCookie(tokenCookieName)
        res.redirect('/')
    }
}

module.exports = new AuthController()
