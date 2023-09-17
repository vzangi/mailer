const Template = require('../models/Template')
const BaseController = require('./BaseController')

class TemplateController extends BaseController {
   
    // Показ редактора шаблона
    async editor(req, res) {
        const { id } = req.params
        const item = await this.model.findByPk(id)
        res.render('pages/templateEditor', { item })
    }

    // Получение шаблона
    async getItem(req, res) {
        const { id } = req.params
        const item = await this.model.findByPk(id)
        res.send(item)
    }

}

module.exports = new TemplateController(Template, 'templates')
