const User = require('../models/User')
const BaseController = require('./BaseController')
const bcrypt = require('bcrypt')

class UsersController extends BaseController {

    // Получение всех пользователей (без поля пароля)
    async getAll(_, res) {
        const items = await User.findAll({
            attributes: ['id', 'name', 'login', 'role']
        })
        res.json(items)
    }

    // Редактирование поля пользователя
    async editField(req, res) {
        const { id, field } = req.body
        let { value } = req.body
        if (field == 'password') {
            value = await bcrypt.hash(value, 10)
        }
        const item = await Transport.findOne({ where: { id } })
        item[field] = value
        item.save()
        res.json({ ok: 1 })
    }

    // Добавление пользователя
    async addItem(req, res) {
        if (!req.user) return res.json(0)
        if (!req.user.role) return res.json(1)
        if (req.user.role != User.SUPER) return res.json(2)

        const { name, login, password } = req.body
        const hash = await bcrypt.hash(password, 10)

        try {
            const user = await User.create({
                name, login, password: hash, role: User.USER
            })
            res.json(user)
        } catch (err) {
            return res.json(err.errors[0].message)
        }
    }
}

module.exports = new UsersController(User, 'users')
