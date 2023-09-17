// Базовый контроллер
class BaseController {
    constructor(model, template) {
        // Основная модель, с которой работает контроллер
        this.model = model

        // Шаблон, который рендерит контроллер
        this.template = template
    }

    // Рендерит базовую страницу контроллера
    index(_, res) {
        res.render(`pages/${this.template}`)
    }

    // Получает все записи из бызы
    async getAll(_, res) {
        try {
            const items = await this.model.findAll({
                order: [['id', 'DESC']]
            })
            res.json(items)
        } catch (err) {
            console.log(err)
            res.status(400).json({ status: 0 })
        }
    }

    async getItem(req, res) {
        try {
            const { id } = req.params
            const item = await this.model.findByPk(id)
            res.json(item)
        } catch (err) {
            console.log(err)
            res.status(400).json({ status: 0 })
        }
    }

    // Удаляет запись из базы
    async removeItem(req, res) {
        const { id } = req.body
        try {
            await this.model.destroy({ where: { id } })
            res.json({ status: 1 })
        } catch (err) {
            console.log(err)
            res.status(400).json({ status: 0 })
        }
    }

    // Редактирует поле в базе данных
    async editField(req, res) {
        try {
            const { id, field, value } = req.body
            const item = await this.model.findOne({ where: { id } })
            item[field] = value
            item.save()
            res.json({ status: 1 })
        } catch (error) {
            console.log(err)
            res.status(400).json({ status: 0 })
        }
    }

    // Создаёт запись в базе данных
    async addItem(req, res) {
        try {
            const newItem = await this.model.create({ ...req.body })
            res.json(newItem)
        } catch (error) {
            console.log(err)
            res.status(400).json({ status: 0 })
        }
    }

}

module.exports = BaseController
