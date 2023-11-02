const fs = require('fs')
const { Op, fn } = require('sequelize')
const BaseController = require('./BaseController')
const Address = require('../models/Address')
const DeliveryGroup = require('../models/DeliveryGroup')
const AddressGroup = require('../models/AddressGroup')
const xl = require('excel4node')
const XLSX = require('xlsx')

class AddressesController extends BaseController {
  // Поиск адресов в базе
  async findItems(req, res) {
    const { address } = req.body

    const finded = await this.model.findAll({
      where: {
        email: {
          [Op.substring]: address,
        },
      },
      attributes: ['id', 'client', 'email'],
      include: [
        {
          model: DeliveryGroup,
          through: { attributes: [] },
        },
      ],
      order: [['id', 'DESC']],
    })

    res.json(finded)
  }

  // Добавление адреса
  async addItem(req, res) {
    const { email, client, checks } = req.body
    try {
      const newAddress = await this.model.create({
        email,
        client,
      })
      for (let groupId of checks) {
        const group = await DeliveryGroup.findByPk(groupId)
        await newAddress.addDeliveryGroup(group)
      }

      const addr = await this.model.scope('withGroups').findByPk(newAddress.id)

      res.json(addr)
    } catch (err) {
      console.log(err.errors)
      res.status(400).json({ ok: 0 })
    }
  }

  // Редактирование групп в которые входит адрес
  async editGroups(req, res) {
    const { addressId, checks } = req.body
    await AddressGroup.destroy({
      where: {
        addressId,
      },
    })
    for (let groupId of checks) {
      await AddressGroup.create({
        addressId,
        deliveryGroupId: groupId,
      })
    }

    const addr = await this.model.scope('withGroups').findByPk(addressId)

    res.json(addr)
  }

  // Выгрузка списка адресов
  async backup(req, res) {
    // Создаю файл
    const wb = new xl.Workbook()

    // Добавляю страницу
    const ws = wb.addWorksheet('Addresses')

    ws.cell(1, 1).string('#')
    ws.cell(1, 2).string('E-mail')
    ws.cell(1, 3).string('Клиент')
    ws.cell(1, 4).string('Группы')

    const addresses = await Address.scope('withGroups').findAll()

    for (let index = 0; index < addresses.length; index++) {
      const groups = addresses[index].deliveryGroups
        .map((g) => g.name)
        .join(',')

      ws.cell(index + 2, 1).number(index + 1)
      ws.cell(index + 2, 2).string(addresses[index].email)
      ws.cell(index + 2, 3).string(addresses[index].client)
      ws.cell(index + 2, 4).string(groups)
    }

    const ds = wb.addWorksheet('Groups')
    ds.cell(1, 1).string('#')
    ds.cell(1, 2).string('Группа')

    const groups = await DeliveryGroup.findAll()
    for (let index = 0; index < groups.length; index++) {
      ds.cell(index + 2, 1).number(index + 1)
      ds.cell(index + 2, 2).string(groups[index].name)
    }

    const path = './public/files/'

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }

    const d = new Date()

    const fName = `file_${d.getTime()}.xlsx`

    // Сохраняю на диск
    await wb.write(`${path}${fName}`)

    res.json(fName)
  }

  // Загрузка из файла
  async restore(req, res) {
    try {
      const groups = Object.values(req.body)
      const { file } = req.files

      const wb = XLSX.read(file.data)
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_json(ws)

      for (let d of data) {
        const email = Object.values(d)[0].toString()

        if (email.indexOf('@') < 0) continue

        const haseAddress = await Address.findOne({ where: { email } })
        if (haseAddress) continue

        const newAddress = await this.model.create({ email, client: '' })

        for (let groupId of groups) {
          const group = await DeliveryGroup.findByPk(groupId)
          await newAddress.addDeliveryGroup(group)
        }
      }
    } catch (error) {
      console.log(error)
    }

    res.redirect('/addresses')
  }

  // Выгрузка списка адресов
  async backup_old(req, res) {
    const excel = fs.createWriteStream('./public/files/file.xls')

    excel.write('#\tE-mail\tКлиент\tГруппы\n')

    const addresses = await Address.scope('withGroups').findAll()
    for (let index = 0; index < addresses.length; index++) {
      const groups = addresses[index].deliveryGroups
        .map((g) => g.name)
        .join(',')
      const row = `${index + 1}\t${addresses[index].email}\t${
        addresses[index].client
      }\t${groups}\n`
      excel.write(row)
    }

    excel.close()

    res.json('ok')
  }
}

module.exports = new AddressesController(Address, 'addresses')
