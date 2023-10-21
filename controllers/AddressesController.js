const fs = require('fs')
const { Op } = require('sequelize')
const BaseController = require('./BaseController')
const Address = require('../models/Address')
const DeliveryGroup = require('../models/DeliveryGroup')
const AddressGroup = require('../models/AddressGroup')

class AddressesController extends BaseController {

    // Поиск адресов в базе
    async findItems(req, res) {
        const { address } = req.body

        const finded = await this.model.findAll({
            where: {
                email: {
                    [Op.substring]: address
                }
            },
            attributes: [
                'id', 'client', 'email'
            ],
            include: [{
                model: DeliveryGroup,
                through: { attributes: [] }
            }],
            order: [['id', 'DESC']]
        })

        res.json(finded)
    }

    // Добавление адреса
    async addItem(req, res) {
        const { email, client, checks } = req.body
        try {
            const newAddress = await this.model.create({
                email, client
            })
            for (let groupId of checks) {
                const group = await DeliveryGroup.findByPk(groupId)
                await newAddress.addDeliveryGroup(group)
            }

            const addr = await this.model.scope('withGroups').findByPk(newAddress.id)

            res.json(addr)
        } catch (err) {
            console.log(err.errors);
            res.status(400).json({ ok: 0 })
        }
    }

    // Редактирование групп в которые входит адрес
    async editGroups(req, res) {
        const { addressId, checks } = req.body
        await AddressGroup.destroy({
            where: {
                addressId
            }
        })
        for (let groupId of checks) {
            await AddressGroup.create({
                addressId,
                deliveryGroupId: groupId
            })
        }

        const addr = await this.model.scope('withGroups').findByPk(addressId)

        res.json(addr)
    }

    // Выгрузка списка адресов
    async backup(req, res) {
        const excel = fs.createWriteStream('./public/files/file.xls');

        excel.write("#\tE-mail\tКлиент\tГруппы\n");

        const addresses = await Address.scope('withGroups').findAll()
        for (let index = 0; index < addresses.length; index++) {
            const groups = addresses[index].deliveryGroups.map(g => g.name).join(',')
            const row = `${index + 1}\t${addresses[index].email}\t${addresses[index].client}\t${groups}\n`
            excel.write(row)
        }

        excel.close();

        res.json('ok')
    }

}

module.exports = new AddressesController(Address, 'addresses')
